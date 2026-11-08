import type { FormEvent } from "react";
import { useRef, useState } from "react";
import { useGlobalToast } from "../../../../shared/ui/GlobalToastContext";
import { z } from "zod";
import { FormField } from "../../../../shared/ui/forms/FormField";
import { SubmitButton } from "../../../../shared/ui/forms/SubmitButton";
import { useZodForm } from "../../../../shared/ui/forms/useZodForm";
import { useNavigate } from "react-router-dom";

export const RegisterForm = () => {
    const registerSchema = z.object({
        tenantId: z.string().min(1, "El espacio de trabajo es requerido"),
        name: z.string().min(1, "El nombre completo es requerido"),
        email: z.string().email("Ingresa un correo electrónico válido"),
        password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
        confirmPassword: z.string().min(1, "Debes confirmar tu contraseña"),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

    type RegisterFormValues = z.infer<typeof registerSchema>;

    const isSubmittingRef = useRef(false);
    const { show } = useGlobalToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const form = useZodForm<RegisterFormValues>(registerSchema, {
        defaultValues: {
            tenantId: "",
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = form.handleSubmit(async (values: RegisterFormValues) => {
        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;
        setIsLoading(true);
        try {
            // Simulamos el registro ya que por ahora es solo frontend
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            show({
                severity: "success",
                summary: "Registro exitoso",
                detail: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.",
                life: 4000,
            });
            
            navigate("/login");
        } finally {
            setIsLoading(false);
            isSubmittingRef.current = false;
        }
    });

    const onSafeSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await onSubmit();
    };

    return (
        <form onSubmit={onSafeSubmit} noValidate className="flex flex-column gap-3" style={{ fontFamily: "Inter, -apple-system, sans-serif" }}>
            <FormField
                id="tenantId"
                label="Espacio de Trabajo (Workspace)"
                required
                error={form.formState.errors.tenantId?.message}
            >
                <input
                    id="tenantId"
                    type="text"
                    placeholder="ej. mi-empresa"
                    className="p-inputtext p-component w-full transition-colors"
                    style={{ outline: "none", boxShadow: "none", borderRadius: "8px", fontSize: "14px", padding: "0.75rem", border: "1px solid #D1D5DB" }}
                    onFocus={e => e.currentTarget.style.borderColor = "#3B82F6"}
                    onBlur={e => e.currentTarget.style.borderColor = "#D1D5DB"}
                    {...form.register("tenantId")}
                />
            </FormField>

            <FormField
                id="name"
                label="Nombre Completo"
                required
                error={form.formState.errors.name?.message}
            >
                <input
                    id="name"
                    type="text"
                    placeholder="Juan Pérez"
                    className="p-inputtext p-component w-full transition-colors"
                    style={{ outline: "none", boxShadow: "none", borderRadius: "8px", fontSize: "14px", padding: "0.75rem", border: "1px solid #D1D5DB" }}
                    onFocus={e => e.currentTarget.style.borderColor = "#3B82F6"}
                    onBlur={e => e.currentTarget.style.borderColor = "#D1D5DB"}
                    {...form.register("name")}
                />
            </FormField>

            <FormField
                id="email"
                label="Correo Electrónico"
                required
                error={form.formState.errors.email?.message}
            >
                <input
                    id="email"
                    type="email"
                    placeholder="juan@ejemplo.com"
                    className="p-inputtext p-component w-full transition-colors"
                    style={{ outline: "none", boxShadow: "none", borderRadius: "8px", fontSize: "14px", padding: "0.75rem", border: "1px solid #D1D5DB" }}
                    onFocus={e => e.currentTarget.style.borderColor = "#3B82F6"}
                    onBlur={e => e.currentTarget.style.borderColor = "#D1D5DB"}
                    autoComplete="email"
                    {...form.register("email")}
                />
            </FormField>

            <div className="flex gap-3">
                <div className="w-6">
                    <FormField
                        id="password"
                        label="Contraseña"
                        required
                        error={form.formState.errors.password?.message}
                    >
                        <input
                            id="password"
                            type="password"
                            className="p-inputtext p-component w-full transition-colors"
                            style={{ outline: "none", boxShadow: "none", borderRadius: "8px", fontSize: "14px", padding: "0.75rem", border: "1px solid #D1D5DB" }}
                            onFocus={e => e.currentTarget.style.borderColor = "#3B82F6"}
                            onBlur={e => e.currentTarget.style.borderColor = "#D1D5DB"}
                            autoComplete="new-password"
                            {...form.register("password")}
                        />
                    </FormField>
                </div>
                <div className="w-6">
                    <FormField
                        id="confirmPassword"
                        label="Confirmar"
                        required
                        error={form.formState.errors.confirmPassword?.message}
                    >
                        <input
                            id="confirmPassword"
                            type="password"
                            className="p-inputtext p-component w-full transition-colors"
                            style={{ outline: "none", boxShadow: "none", borderRadius: "8px", fontSize: "14px", padding: "0.75rem", border: "1px solid #D1D5DB" }}
                            onFocus={e => e.currentTarget.style.borderColor = "#3B82F6"}
                            onBlur={e => e.currentTarget.style.borderColor = "#D1D5DB"}
                            autoComplete="new-password"
                            {...form.register("confirmPassword")}
                        />
                    </FormField>
                </div>
            </div>

            <div className="mt-3">
                <SubmitButton
                    label="Crear Cuenta"
                    loadingLabel="Registrando..."
                    isSubmitting={isLoading}
                    className="w-full text-white font-semibold py-3 cursor-pointer transition-colors transition-duration-200"
                    style={{ backgroundColor: "#3B82F6", border: "none", borderRadius: "8px", fontSize: "16px" }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3B82F6")}
                />
            </div>
            
            <div className="flex align-items-center mt-3 mb-2">
                <div style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }}></div>
                <span style={{ margin: "0 1rem", color: "#6B7280", fontSize: "0.875rem", fontWeight: 500 }}>o registrate con</span>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }}></div>
            </div>

            <button
                type="button"
                className="w-full flex align-items-center justify-content-center py-3 cursor-pointer transition-colors transition-duration-200"
                style={{ backgroundColor: "#ffffff", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "15px", fontWeight: 600, color: "#374151" }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#F9FAFB")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            >
                <i className="pi pi-google mr-2" style={{ color: "#EA4335" }}></i>
                Continuar con Google
            </button>
        </form>
    );
};
