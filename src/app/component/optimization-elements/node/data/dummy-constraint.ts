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
  typeName: "BindingResource",
};

export const EmptyExcludingResourceConstraintType: ExcludingResourceConstraint = {
  resources: [DummyConstraintResource],
  typeName: "ExcludingResource"
};

export const EmptyBindingResourceConstraint: Constraint = {
  type: EmptyBindingResourceConstraintType,
  isHard: false,
};

export const EmptyExcludingResourceConstraint: Constraint = {
  type: EmptyExcludingResourceConstraintType,
  isHard: false,
};
