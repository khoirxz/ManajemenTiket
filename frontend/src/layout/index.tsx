import CssBaseline from "@mui/material/CssBaseline";

import DashboardLayout from "../components/DashboardLayout";

import NotificationsProvider from "../hooks/useNotifications/NotificationsProvider";
import DialogsProvider from "../hooks/useDialogs/DialogsProvider";
import AppTheme from "../theme/AppTheme";
import {
  dataGridCustomizations,
  sidebarCustomizations,
  formInputCustomizations,
} from "../theme/customizations";

const themeComponents = {
  ...dataGridCustomizations,
  ...sidebarCustomizations,
  ...formInputCustomizations,
};

export default function CrudDashboard(props: {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
}) {
  const { children } = props;
  return (
    <AppTheme {...props} themeComponents={themeComponents}>
      <CssBaseline enableColorScheme />
      <NotificationsProvider>
        <DialogsProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
  );
}
