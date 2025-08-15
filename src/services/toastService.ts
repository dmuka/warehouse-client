import { inject } from "vue";
import type { App } from "vue";
import type { ToastMessageOptions } from "primevue/toast";

type ToastSeverity = "success" | "info" | "warn" | "error";

export class ToastService {
  private static instance: ToastService;
  private appContext: App | null = null;

  public static getInstance(): ToastService {
    if (!ToastService.instance) {
      ToastService.instance = new ToastService();
    }
    return ToastService.instance;
  }

  public initialize(app: App): void {
    this.appContext = app;
  }

  private show(
    message: string,
    severity: ToastSeverity,
    options?: Partial<ToastMessageOptions>
  ): void {
    if (!this.appContext) {
      console.error(
        "ToastService not initialized. Make sure to call initialize() first."
      );
      return;
    }

    this.appContext.config.globalProperties.$toast.add({
      severity,
      summary: message,
      life: 3000,
      ...options,
    } as ToastMessageOptions);
  }

  public success(
    message: string,
    options?: Partial<ToastMessageOptions>
  ): void {
    this.show(message, "success", options);
  }

  public error(message: string, options?: Partial<ToastMessageOptions>): void {
    this.show(message, "error", { life: 5000, ...options });
  }

  public warn(message: string, options?: Partial<ToastMessageOptions>): void {
    this.show(message, "warn", options);
  }

  public info(message: string, options?: Partial<ToastMessageOptions>): void {
    this.show(message, "info", options);
  }

  public custom(options: ToastMessageOptions): void {
    if (!this.appContext) {
      console.error(
        "ToastService not initialized. Make sure to call initialize() first."
      );
      return;
    }
    this.appContext.config.globalProperties.$toast.add(options);
  }

  public apiError(error: any, defaultMessage = "An error occurred"): void {
    const message = error.response?.data?.message || defaultMessage;
    this.error(message, { life: 8000 });
  }

  public networkError(): void {
    this.error(
      "Network connection error. Please check your internet connection.",
      {
        life: 10000,
      }
    );
  }
}

const toastService = ToastService.getInstance();

export function useToast() {
  const app = inject("app") as App | undefined;
  const toast = inject("toastService") as ToastService | undefined;

  if (app && toast) {
    toast.initialize(app);
  } else if (!toast) {
    console.error(
      "ToastService not provided. Make sure to provide it in your app setup."
    );
  }

  return toast || ToastService.getInstance();
}
