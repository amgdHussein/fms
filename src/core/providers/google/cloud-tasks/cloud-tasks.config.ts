import { Settings } from '@google-cloud/firestore';

export interface CloudTasksConfigs extends Settings {
  projectRegion: string;
}
