import { requestJson } from './http';
import { apiPath } from '../utils/apiPath';
import type { EstimateInput, EstimateResult } from '../types/estimate';

export async function estimateEvent(input: EstimateInput): Promise<EstimateResult> {
  return requestJson<EstimateResult>(apiPath('/estimate'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  });
}
