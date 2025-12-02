import { useEffect, useState } from "react";
import { useOidc } from "../../auth/oidcConfig";
import { UserRole } from "../../enums/userRole";

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<UserRole>()
  const { isUserLoggedIn, decodedIdToken } = useOidc();

  useEffect(() => {
    if (isUserLoggedIn && decodedIdToken) {
      const rolesKeyName: string | undefined = Object.keys(decodedIdToken).find((key) => key.includes('roles'));
      const idTokenRoles: string[] = decodedIdToken[rolesKeyName!] as string[];

      let newUserRole: string | undefined;

      for (const key in UserRole) {
        if (UserRole[key as keyof typeof UserRole] === idTokenRoles[0]) {
          newUserRole = key;

          break;
        }
      }

      setUserRole(UserRole[newUserRole! as keyof typeof UserRole]);
    }
  }, [decodedIdToken, isUserLoggedIn])

  return {
    userRole
  }
}