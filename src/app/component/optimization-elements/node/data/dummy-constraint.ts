import {
  JOptBindingResourceConstraint,
  JOptConstraintResource,
  JOptExcludingResourceConstraint,
  JOptConstraint,
} from 'build/openapi';

export const EmptyConstraint: JOptConstraint = {
  bindingResources: [],
  excludingResources: [],
};

export const EmptyBindingResourceConstraint: JOptBindingResourceConstraint = {
  resources: [],
  hard: false,
};

export const EmptyExcludingResourceConstraint: JOptExcludingResourceConstraint = {
  resources: [],
  hard: false,
};

export const DummyConstraintResource: JOptConstraintResource = {
  id: '--',
  priority: 1,
};
