import { useEffect, useState } from "react";
import { useOidc } from "../../auth/oidcConfig";
import { UserRole } from "../../enums/userRole";

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<UserRole>()
  const { isUserLoggedIn, decodedIdToken } = useOidc();

  useEffect(() => {
    if (isUserLoggedIn && decodedIdToken) {
      const idTokenRoles: string[] = decodedIdToken!.roles as string[];

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