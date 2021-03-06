import {ObjectId} from 'mongodb';

import {TaskMetadataSource, TaskNode, TaskStage, TaskTag} from '../../types';

import {GitHubIssueProviderOptions} from './github';
import {GitLabIssueProviderOptions} from './gitlab';

export interface IssueDocument {
  _id: ObjectId;
  organization: string;
  appInstallation: string;
  issueNumber: number;
  token: string;
  clock: number;
  task: string;
  options: IssueProviderOptions;
}

export type IssueProviderOptions =
  | GitHubIssueProviderOptions
  | GitLabIssueProviderOptions;

export interface IIssue {
  organization: string;
  installation: string;
  token: string;
  clock: number;
  task: string;
  options: object;
  tagsPattern: string;
  stagesPattern: string;
  taskStage: TaskStage;
  taskBrief: string;
  taskDescription: string;
  taskNodes: TaskNode[];
  taskTags: TaskTag[];
  taskMetadataSource?: TaskMetadataSource;
  taskURL: string;
  removed: boolean;
}
