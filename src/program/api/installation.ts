import {API} from '@makeflow/types';
import Router from 'koa-router';

import {InstallationService} from '../services';
import {requestProcessor} from '../utils';

export function routeInstallation(
  installationService: InstallationService,
  apiRouter: Router,
): void {
  apiRouter.post(
    // TODO: Extract
    '/:type(github|gitlab)/installation/(activate|update)',
    requestProcessor(async ctx => {
      let {
        source: {
          url,
          organization: organizationId,
          installation: installationId,
        },
      } = ctx.request.body as
        | API.PowerApp.InstallationUpdateHookParams
        | API.PowerApp.InstallationActivateHookParams;

      console.info(
        `touching installation "${installationId}" from "${organizationId}"`,
      );

      let granted = await installationService.touchInstallation({
        organization: organizationId,
        installation: installationId,
        makeflowBaseURL: url,
      });

      return {
        granted,
      };
    }),
  );

  apiRouter.post(
    '/:type(github|gitlab)/installation/deactivate',
    requestProcessor(async ctx => {
      let {
        source: {organization: organizationId, installation: installationId},
      } = ctx.request.body as API.PowerApp.InstallationDeactivateHookParams;

      console.info(
        `deactivating installation "${installationId}" from "${organizationId}"`,
      );

      await installationService.deactivateInstallation({
        organization: organizationId,
        installation: installationId,
      });
    }),
  );

  apiRouter.post(
    '/:type(github|gitlab)/permission/grant',
    requestProcessor(async ctx => {
      let {
        source: {organization: organizationId, installation: installationId},
        accessToken,
      } = ctx.request.body as API.PowerApp.PermissionGrantHookParams;

      console.info(
        `granted permission for installation "${installationId}" from "${organizationId}"`,
      );

      await installationService.grantPermission(
        {
          organization: organizationId,
          installation: installationId,
        },
        accessToken,
      );
    }),
  );

  apiRouter.post(
    '/:type(github|gitlab)/permission/revoke',
    requestProcessor(async ctx => {
      let {
        source: {organization: organizationId, installation: installationId},
      } = ctx.request.body as API.PowerApp.PermissionRevokeHookParams;

      console.info(
        `revoked permission for installation "${installationId}" from "${organizationId}"`,
      );

      await installationService.revokePermission({
        organization: organizationId,
        installation: installationId,
      });
    }),
  );
}
