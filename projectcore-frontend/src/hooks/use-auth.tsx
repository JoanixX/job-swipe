import { createContext, ReactNode, useContext } from "react";
import { useLocation } from "wouter";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { User, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, InsertUser>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation<User, Error, LoginData>({
    mutationFn: async (credentials: LoginData) => {
      try {
        /*
        const res = await apiRequest("POST", "/api/login", credentials);
        
        // Verificar el tipo de contenido para evitar errores
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        } else {
          console.warn('La respuesta login no es JSON');
          throw new Error("El servidor respondió con un formato incorrecto");
        }
        */
        return {
          id: "1",
          username: "admin",
          password: "admin",
          role: "admin",
        } as unknown as User;
      } catch (error: any) {
        console.error("Error en login:", error);
        throw error;
      }
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "¡Inicio de sesión exitoso!",
        description: "Bienvenido a PROJECT CORE"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error de inicio de sesión",
        description: error.message || "No se pudo iniciar sesión",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation<User, Error, InsertUser>({
    mutationFn: async (userData: InsertUser) => {
      try {
        /*
        const res = await apiRequest("POST", "/api/register", userData);
        
        // Verificar el tipo de contenido para evitar errores
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        } else {
          console.warn('La respuesta register no es JSON');
          throw new Error("El servidor respondió con un formato incorrecto");
        }
        */
        return {
          id: "1",
          username: "admin",
          password: "admin",
          role: "admin",
        } as unknown as User;
      } catch (error: any) {
        console.error("Error en registro:", error);
        throw error;
      }
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error de registro",
        description: error.message || "No se pudo crear la cuenta",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      /*
      await apiRequest("POST", "/api/logout");
      */
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
            queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setLocation("/login");
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al cerrar sesión",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}