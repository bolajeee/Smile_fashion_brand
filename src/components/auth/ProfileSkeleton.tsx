const ProfileSkeleton = () => {
  return (
    <div className="profile-skeleton">
      <div className="profile-skeleton__avatar" />
      <div className="profile-skeleton__info">
        <div className="profile-skeleton__line" />
        <div className="profile-skeleton__line" />
        <div className="profile-skeleton__line" />
      </div>
      <div className="profile-skeleton__stats" />
    </div>
  );
};

export default ProfileSkeleton;
