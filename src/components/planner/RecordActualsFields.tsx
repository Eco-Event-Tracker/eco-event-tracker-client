import { FormField } from '../ui/FormField';
import { PageSection } from '../ui/PageSection';
import type { PlannerValues } from '../../utils/planner';
import { plannerInputClassName } from './constants';

interface RecordActualsFieldsProps {
  values: PlannerValues;
  isPhysical: boolean;
  setField: <K extends keyof PlannerValues>(field: K, value: PlannerValues[K]) => void;
}

/**
 * Hindsight-only fields. Because a past event is being recorded, the organizer
 * may know real measured numbers — these override the headcount estimates.
 * Leave any blank to keep the estimate for that category.
 */
export function RecordActualsFields({ values, isPhysical, setField }: RecordActualsFieldsProps) {
  if (!isPhysical) {
    return null;
  }

  return (
    <PageSection
      title="Measured actuals (optional)"
      description="Know the real numbers? Enter them to replace the estimates. Leave blank to keep the estimate."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Electricity used (kWh)" htmlFor="energyKwh">
          <input
            id="energyKwh"
            type="number"
            min={0}
            step="any"
            inputMode="decimal"
            placeholder="Estimated"
            className={plannerInputClassName}
            value={values.energyKwh}
            onChange={(event) => setField('energyKwh', event.target.value)}
          />
        </FormField>

        <FormField label="Waste generated (kg)" htmlFor="wasteKg">
          <input
            id="wasteKg"
            type="number"
            min={0}
            step="any"
            inputMode="decimal"
            placeholder="Estimated"
            className={plannerInputClassName}
            value={values.wasteKg}
            onChange={(event) => setField('wasteKg', event.target.value)}
          />
        </FormField>

        <FormField label="Meals served" htmlFor="mealsServed">
          <input
            id="mealsServed"
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            placeholder="Estimated"
            className={plannerInputClassName}
            value={values.mealsServed}
            onChange={(event) => setField('mealsServed', event.target.value)}
          />
        </FormField>
      </div>
    </PageSection>
  );
}
