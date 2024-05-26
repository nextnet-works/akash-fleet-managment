import * as YAML from "yaml";

type WebService = {
  image: string;
  expose: Array<{
    port: number;
    as?: number;
    proto?: string;
    to: { global: boolean }[];
  }>;
  env: string[];
  params?: {
    storage: {
      data: {
        mount: string;
        readOnly: boolean;
      };
    };
  };
};

type WebProfile = {
  resources: {
    cpu: { units: number };
    memory: { size: string };
    storage: Array<{
      size: string;
      name?: string;
      attributes?: { persistent: boolean; class: string };
    }>;
    gpu?: {
      units: number;
      attributes: { vendor: { nvidia: { model: string }[] } };
    };
  };
};

type PlacementPricing = {
  denom: string;
  amount: number;
};

type WebDeployment = {
  profile: string;
  count: number;
};

type YamlData = {
  version: string;
  services: { [key: string]: WebService };
  profiles: {
    compute: { [key: string]: WebProfile };
    placement: {
      [key: string]: {
        pricing: { [key: string]: PlacementPricing };
        attributes?: { host: string };
      };
    };
  };
  deployment: { [key: string]: { [key: string]: WebDeployment } };
};

export type GenericYaml = {
  version: string;
  services: { node: WebService };
  profiles: {
    compute: { node: WebProfile };
    placement: {
      [key: string]: {
        pricing: {
          [key: string]: PlacementPricing;
        };
        attributes?: { host: string };
        signedBy?: { anyOf: string[] };
      };
    };
  };
  deployment: { [key: string]: { [key: string]: WebDeployment } };
};

export function generateYamlWithWebs(count: number, data: GenericYaml): string {
  count = Math.min(count, 5);

  const output: YamlData = {
    version: "2.0",
    services: {},
    profiles: {
      compute: {},
      placement: {},
    },
    deployment: {},
  };

  for (let i = 1; i <= count; i++) {
    const key = `web-${i}`;
    output.services[key] = data.services.node;
    output.profiles.compute[key] = data.profiles.compute.node;

    output.profiles.placement[`global${i}`] = {
      pricing: {
        [key]: {
          denom: "uakt",
          amount: 1000,
        },
      },
    };

    data.deployment[key] = {};

    data.deployment[key][`global${i}`] = {
      profile: key,
      count: 1,
    };
  }

  const yamlStr = YAML.stringify(data);

  return yamlStr;
}
