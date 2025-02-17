import { Injectable } from '@angular/core';
import { AbstractAppConfig, CaseEditorConfig } from '@hmcts/ccd-case-ui-toolkit';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { AppConfigService } from '../config/configuration.services';
import { AppConstants } from '../../app.constants';
import { AppUtils } from '../../app-utils';
import { WorkAllocationTaskService } from '../../../work-allocation/services';

/**
 * see more:
 * https://tools.hmcts.net/confluence/pages/viewpage.action?pageId=797343913#Integrationsteps-Caseview(`ccd-case-view`)
 * is explained why this is needed
 */

@Injectable()
export class AppConfig extends AbstractAppConfig {
  protected config: CaseEditorConfig;
  public workallocationUrl: string;

  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly featureToggleService: FeatureToggleService
  ) {
    super();
    this.config = this.appConfigService.getEditorConfiguration() || {};
    this.featureToggleWorkAllocation();
  }

  private featureToggleWorkAllocation(): void {
    this.featureToggleService
      .isEnabled(AppConstants.FEATURE_NAMES.workAllocation)
      .subscribe(
        (isFeatureEnabled) =>
          this.workallocationUrl = AppUtils.getFeatureToggledUrl(
            isFeatureEnabled,
            WorkAllocationTaskService.WorkAllocationUrl
          )
      );
  }

  public load(): Promise<void> {
    return Promise.resolve();
  }

  public getLoginUrl(): string {
    return this.config.login_url;
  }

  public getApiUrl() {
    return this.config.api_url;
  }

  public getCaseDataUrl() {
    return this.config.case_data_url;
  }

  public getDocumentManagementUrl() {
    return this.config.document_management_url;
  }

  public getRemoteDocumentManagementUrl() {
    return this.config.remote_document_management_url;
  }

  public getPostcodeLookupUrl() {
    return this.config.postcode_lookup_url;
  }

  public getOAuth2ClientId() {
    return this.config.oauth2_client_id;
  }

  public getPaymentsUrl() {
    return this.config.payments_url;
  }

  public getCaseHistoryUrl(caseId: string, eventId: string) {
    return (
      this.getCaseDataUrl() +
      `/internal` +
      `/cases/${caseId}` +
      `/events/${eventId}`
    );
  }

  public getCreateOrUpdateDraftsUrl(ctid: string) {
    return this.getCaseDataUrl() + `/internal/case-types/${ctid}/drafts/`;
  }

  public getViewOrDeleteDraftsUrl(did: string) {
    return this.getCaseDataUrl() + `/drafts/${did}`;
  }

  public getActivityUrl() {
    return this.config.activity_url;
  }

  public getActivityNexPollRequestMs() {
    return this.config.activity_next_poll_request_ms;
  }

  public getActivityRetry() {
    return this.config.activity_retry;
  }

  public getActivityBatchCollectionDelayMs() {
    return this.config.activity_batch_collection_delay_ms;
  }

  public getActivityMaxRequestPerBatch() {
    return this.config.activity_max_request_per_batch;
  }

  public getPrintServiceUrl() {
    return this.config.print_service_url;
  }

  public getRemotePrintServiceUrl() {
    return this.config.remote_print_service_url;
  }

  public getPaginationPageSize(): number {
    return this.config.pagination_page_size;
  }

  public getAnnotationApiUrl(): string {
    return this.config.annotation_api_url;
  }

  public getPayBulkScanBaseUrl(): string {
    return this.config.pay_bulk_scan_url;
  }

  public getBannersUrl(): string {
    return `${this.getCaseDataUrl()}/internal/banners/`;
  }

  public getPrdUrl(): string {
    return 'api/caseshare/orgs';
  }

  public getCacheTimeOut(): number {
    return 45000;
  }

  public getWorkAllocationApiUrl(): string {
    return this.workallocationUrl;
  }
}
