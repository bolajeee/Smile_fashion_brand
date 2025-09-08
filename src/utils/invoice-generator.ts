import PDFDocument from 'pdfkit';
import type { Order } from '@/types/order';
import path from 'path';

interface InvoiceOptions {
  fontSize?: {
    header: number;
    subheader: number;
    normal: number;
    small: number;
  };
  colors?: {
    primary: string;
    text: string;
    subtle: string;
  };
  darkMode?: boolean;
}

const defaultOptions: Required<InvoiceOptions> = {
  fontSize: {
    header: 20,
    subheader: 14,
    normal: 12,
    small: 10,
  },
  colors: {
    primary: '#2563eb',
    text: '#1f2937',
    subtle: '#6b7280',
  },
  darkMode: false
};

export async function generateInvoice(order: Order, options?: InvoiceOptions): Promise<Buffer> {
  // Merge options with defaults
  const mergedOptions: Required<InvoiceOptions> = {
    ...defaultOptions,
    ...options,
    fontSize: { ...defaultOptions.fontSize, ...options?.fontSize },
    colors: { ...defaultOptions.colors, ...options?.colors },
  };

  const { fontSize, colors } = mergedOptions;

  return new Promise((resolve) => {
    const doc = new PDFDocument({ 
      margin: 50,
      size: 'A4',
      info: {
        Title: `Invoice-${order.id}`,
        Author: 'Smile',
      }
    });
    
    const chunks: Uint8Array[] = [];

    // Collect the PDF data chunks
    doc.on('data', (chunk: Uint8Array) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    const { fontSize = defaultOptions.fontSize, colors = defaultOptions.colors } = options || defaultOptions;
    
    // Set default font
    doc.font('Helvetica');

    // Add logo
    const logoPath = options?.darkMode 
      ? path.join(process.cwd(), 'public', 'images', 'logos', 'smile-logo-dark.jpg')
      : path.join(process.cwd(), 'public', 'images', 'logos', 'smile-logo-light.jpg');

    try {
      doc.image(logoPath, 50, 45, { width: 120 })
         .moveDown(2);
    } catch (error) {
      // Fallback to text if logo can't be loaded
      doc.fontSize(fontSize.header)
         .fillColor(colors.primary)
         .text('Smile', 50, 50, { align: 'left' })
         .moveDown(0.5);
    }

    // Add company info section
    doc.fontSize(fontSize.small)
       .fillColor(colors.subtle)
       .text('123 Fashion Street')
       .text('Lagos, Nigeria')
       .text('Phone: +234 123 456 7890')
       .text('Email: sales@smilefashion.com');

    // Add invoice details on the right
    doc.fontSize(fontSize.normal)
       .fillColor(colors.text)
       .text('INVOICE', 400, 50, { align: 'right' })
       .fontSize(fontSize.small)
       .fillColor(colors.subtle)
       .text(`Invoice No: #${order.id.slice(0, 8)}`, { align: 'right' })
       .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, { align: 'right' })
       .text(`Status: ${order.status}`, { align: 'right' });

    // Add horizontal line with proper spacing
    doc.moveDown(3)
       .strokeColor(colors.subtle)
       .lineWidth(0.5)
       .moveTo(50, doc.y)
       .lineTo(550, doc.y)
       .stroke()
       .moveDown(2);

    // Add billing details
    const startY = doc.y;
    
    // Ship To section
    doc.fontSize(fontSize.normal)
       .fillColor(colors.text)
       .text('Ship To:', 50, startY)
       .fontSize(fontSize.small)
       .fillColor(colors.subtle);
    
    const addressLines = order.shippingAddress.split('\n');
    addressLines.forEach(line => {
      doc.text(line);
    });
    
    // Add items table
    doc.moveDown(2);
    const tableTop = doc.y;
    const tableHeaders = ['Item', 'Qty', 'Price', 'Total'];
    const columnWidths = [250, 70, 100, 80];
    const startX = 50;
    
    // Draw headers
    doc.fontSize(fontSize.small)
       .fillColor(colors.text);
    
    tableHeaders.forEach((header, i) => {
      doc.text(
        header,
        startX + (i > 0 ? columnWidths.slice(0, i).reduce((sum, w) => sum + w, 0) : 0),
        tableTop,
        { width: columnWidths[i], align: i > 0 ? 'right' : 'left' }
      );
    });
    
    // Draw header line
    doc.strokeColor(colors.subtle)
       .lineWidth(0.5)
       .moveTo(50, tableTop + 15)
       .lineTo(550, tableTop + 15)
       .stroke();
    
    // Draw items
    let itemY = tableTop + 25;
    
    order.items.forEach((item) => {
      // Draw item row with alternating background
      doc.fillColor(colors.text)
         .fontSize(fontSize.small);
      
      // Item name - truncate if too long
      const itemName = (item.name || 'Product').length > 30 
        ? (item.name || 'Product').substring(0, 27) + '...'
        : (item.name || 'Product');
      
      doc.text(itemName, startX, itemY, { width: columnWidths[0] });
      
      // Quantity
      doc.text(
        item.quantity.toString(),
        startX + columnWidths[0],
        itemY,
        { width: columnWidths[1], align: 'right' }
      );
      
      // Price
      doc.text(
        `$${item.price.toFixed(2)}`,
        startX + columnWidths[0] + columnWidths[1],
        itemY,
        { width: columnWidths[2], align: 'right' }
      );
      
      // Total
      doc.text(
        `$${(item.quantity * item.price).toFixed(2)}`,
        startX + columnWidths[0] + columnWidths[1] + columnWidths[2],
        itemY,
        { width: columnWidths[3], align: 'right' }
      );
      
      itemY += 20;
    });

    // Add final total line
    doc.strokeColor(colors.subtle)
       .lineWidth(0.5)
       .moveTo(50, itemY + 10)
       .lineTo(550, itemY + 10)
       .stroke();

    // Add total amount
    itemY += 20;
    doc.fontSize(fontSize.normal)
       .fillColor(colors.text);

    // Create a table for totals
    const totalsStartX = 350;
    const labelWidth = 100;
    const valueWidth = 100;

    // Subtotal
    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    doc.text('Subtotal', totalsStartX, itemY, { width: labelWidth })
       .text(`$${subtotal.toFixed(2)}`, totalsStartX + labelWidth, itemY, { width: valueWidth, align: 'right' });

    // Shipping (if applicable)
    const shipping = 0; // Add shipping calculation if needed
    itemY += 20;
    doc.text('Shipping', totalsStartX, itemY, { width: labelWidth })
       .text(`$${shipping.toFixed(2)}`, totalsStartX + labelWidth, itemY, { width: valueWidth, align: 'right' });

    // Total
    itemY += 25;
    doc.fontSize(fontSize.subheader)
       .fillColor(colors.primary)
       .text('Total', totalsStartX, itemY, { width: labelWidth })
       .text(`$${order.total.toFixed(2)}`, totalsStartX + labelWidth, itemY, { width: valueWidth, align: 'right' });

    // Add footer
    doc.fontSize(fontSize.small)
       .fillColor(colors.text)
       .text(
         'Thank you for shopping with Smile!',
         50,
         doc.page.height - 100,
         { align: 'center' }
       )
       .moveDown(0.5)
       .fillColor(colors.subtle)
       .fontSize(fontSize.small)
       .text(
         'For any questions about this invoice, please contact our customer service.',
         { align: 'center' }
       );

    // Finalize the PDF
    doc.end();
  });
}
