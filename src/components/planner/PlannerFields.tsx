import { FormField } from '../ui/FormField';
import { PageSection } from '../ui/PageSection';
import { Segmented } from '../ui/Segmented';
import type {
  AudienceReach,
  CateringOption,
  EventFormat,
  PowerSourceOption,
  StreamQuality,
  WasteDisposalOption
} from '../../types/estimate';
import type { PlannerValues } from '../../utils/planner';
import { plannerInputClassName } from './constants';

interface PlannerFieldsProps {
  values: PlannerValues;
  isPhysical: boolean;
  hasOnline: boolean;
  setField: <K extends keyof PlannerValues>(field: K, value: PlannerValues[K]) => void;
}

export function PlannerFields({ values, isPhysical, hasOnline, setField }: PlannerFieldsProps) {
  return (
    <>
      <PageSection title="Your event" description="What you already know at planning time.">
        <div className="space-y-4">
          <FormField label="Format" htmlFor="format">
            <Segmented
              options={[
                { value: 'in_person', label: 'In person' },
                { value: 'hybrid', label: 'Hybrid' },
                { value: 'virtual', label: 'Virtual' }
              ]}
              value={values.format}
              onChange={(value) => setField('format', value as EventFormat)}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            {isPhysical ? (
              <FormField label="In-room attendance" htmlFor="attendance">
                <input
                  id="attendance"
                  type="number"
                  min={0}
                  step={1}
                  className={plannerInputClassName}
                  value={values.attendance}
                  onChange={(event) => setField('attendance', event.target.value)}
                />
              </FormField>
            ) : null}

            {hasOnline ? (
              <FormField label="Online participants" htmlFor="onlineAttendance">
                <input
                  id="onlineAttendance"
                  type="number"
                  min={0}
                  step={1}
                  className={plannerInputClassName}
                  value={values.onlineAttendance}
                  onChange={(event) => setField('onlineAttendance', event.target.value)}
                />
              </FormField>
            ) : null}

            <FormField label="Hours / day" htmlFor="durationHours">
              <input
                id="durationHours"
                type="number"
                min={0.5}
                step={0.5}
                className={plannerInputClassName}
                value={values.durationHours}
                onChange={(event) => setField('durationHours', event.target.value)}
              />
            </FormField>

            <FormField label="Days" htmlFor="days">
              <input
                id="days"
                type="number"
                min={1}
                step={1}
                className={plannerInputClassName}
                value={values.days}
                onChange={(event) => setField('days', event.target.value)}
              />
            </FormField>
          </div>
        </div>
      </PageSection>

      <PageSection title="The levers" description="Flip these to see what cuts the most.">
        <div className="space-y-4">
          {isPhysical ? (
            <>
              <FormField label="Venue power" htmlFor="powerSource">
                <Segmented
                  options={[
                    { value: 'grid', label: 'Grid' },
                    { value: 'generator', label: 'Generator' },
                    { value: 'solar', label: 'Solar' },
                    { value: 'mixed', label: 'Grid + gen' }
                  ]}
                  value={values.powerSource}
                  onChange={(value) => setField('powerSource', value as PowerSourceOption)}
                />
              </FormField>

              <FormField label="Where attendees travel from" htmlFor="audienceReach">
                <Segmented
                  options={[
                    { value: 'local', label: 'Local' },
                    { value: 'regional', label: 'Regional' },
                    { value: 'national', label: 'National' },
                    { value: 'international', label: 'International' }
                  ]}
                  value={values.audienceReach}
                  onChange={(value) => setField('audienceReach', value as AudienceReach)}
                />
              </FormField>

              <FormField label="Catering" htmlFor="catering">
                <Segmented
                  options={[
                    { value: 'none', label: 'None' },
                    { value: 'plant_forward', label: 'Plant-forward' },
                    { value: 'mixed', label: 'Mixed' },
                    { value: 'meat_heavy', label: 'Meat-heavy' }
                  ]}
                  value={values.catering}
                  onChange={(value) => setField('catering', value as CateringOption)}
                />
              </FormField>

              <FormField label="Waste handling" htmlFor="wasteDisposal">
                <Segmented
                  options={[
                    { value: 'landfill', label: 'Landfill' },
                    { value: 'recycling', label: 'Recycling' },
                    { value: 'composting', label: 'Composting' }
                  ]}
                  value={values.wasteDisposal}
                  onChange={(value) => setField('wasteDisposal', value as WasteDisposalOption)}
                />
              </FormField>
            </>
          ) : null}

          {hasOnline ? (
            <FormField label="Streaming quality" htmlFor="streamQuality">
              <Segmented
                options={[
                  { value: 'sd', label: 'SD' },
                  { value: 'hd', label: 'HD' }
                ]}
                value={values.streamQuality}
                onChange={(value) => setField('streamQuality', value as StreamQuality)}
              />
            </FormField>
          ) : null}
        </div>
      </PageSection>
    </>
  );
}
