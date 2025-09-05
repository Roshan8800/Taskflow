import { NavigationProp, RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  TaskDetail: { taskId: string };
  Profile: undefined;
  ThemeSettings: undefined;
  AccessibilitySettings: undefined;
  BackupSettings: undefined;
  SecuritySettings: undefined;
  NotificationCenter: undefined;
};

export type NavigationProps = NavigationProp<RootStackParamList>;
export type RouteProps<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;