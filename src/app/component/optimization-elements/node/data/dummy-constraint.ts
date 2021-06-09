import {
  BindingResourceConstraint,
  ExcludingResourceConstraint,
  Constraint,
  ResourceWithPriority
} from 'build/openapi';


export const DummyConstraintResource: ResourceWithPriority = {
  resourceId: '--',
  priority: 1,
};

export const EmptyBindingResourceConstraintType: BindingResourceConstraint = {
  resources: [DummyConstraintResource],
  _: "BindingResource",
};

export const EmptyExcludingResourceConstraintType: ExcludingResourceConstraint = {
  resources: [DummyConstraintResource],
  _: "ExcludingResource"
};

export const EmptyBindingResourceConstraint: Constraint = {
  type: EmptyBindingResourceConstraintType,
  isHard: false,
};

export const EmptyExcludingResourceConstraint: Constraint = {
  type: EmptyExcludingResourceConstraintType,
  isHard: false,
};
