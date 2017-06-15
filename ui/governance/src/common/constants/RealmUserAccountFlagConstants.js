// Realm/User/Account Flag constants

export const UserFlags = {
    DeactivatedFlag : 0x00000040
};

export const RealmDirFlags = {
    DeniedFlag : 0x0008,
    RealmApprovedFlag : 0x0004,
    RegisteredFlag : 0x0010,
    VerifiedFlag    : 0x0020
};

export const AccountTrusteeFlags = {
    CanCreateAppFlag : 0x0004
};

// Helper Flag Functions
export const HasFlag = (bits, flag) => (bits & flag) !== 0;

export const IsVerified = userInfo => HasFlag(userInfo.realmDirectoryFlags, RealmDirFlags.VerifiedFlag);
export const IsRegistered = userInfo => HasFlag(userInfo.realmDirectoryFlags, RealmDirFlags.RegisteredFlag);

export const IsDeactivated = userInfo => HasFlag(userInfo.userBasicFlags, UserFlags.DeactivatedFlag);
export const IsDenied = userInfo => HasFlag(userInfo.realmDirectoryFlags, RealmDirFlags.DeniedFlag);
export const CanCreateApps = userInfo => HasFlag(userInfo.accountTrusteeFlags, AccountTrusteeFlags.CanCreateAppFlag);
export const IsApprovedInRealm = userInfo => HasFlag(userInfo.realmDirectoryFlags, RealmDirFlags.RealmApprovedFlag);
export const HasAnyRealmPermissions = userInfo => userInfo.realmDirectoryFlags !== 0;
export const HasAnySystemPermissions = userInfo => userInfo.systemRights !== 0;

