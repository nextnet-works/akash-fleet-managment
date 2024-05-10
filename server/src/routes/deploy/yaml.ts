import * as fs from "fs";
import * as YAML from "yaml";

type WebService = {
  image: string;
  expose: Array<{
    port: number;
    as: number;
    proto?: string;
    to: { global: boolean }[];
  }>;
  env: string[];
  params: {
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
      [key: string]: { pricing: { [key: string]: PlacementPricing } };
    };
  };
  deployment: { [key: string]: { [key: string]: WebDeployment } };
};

export function generateYamlWithWebs(count: number): void {
  const data: YamlData = {
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
    data.services[key] = {
      image: "linuxserver/webtop:amd64-ubuntu-xfce",
      expose: [
        { port: 3000, as: 3000, to: [{ global: true }] },
        { port: 22, as: 22, proto: "tcp", to: [{ global: true }] },
        { port: 11434, as: 11434, to: [{ global: true }] },
      ],
      env: ["OLLAMA_DEBUG=1"],
      params: {
        storage: {
          data: {
            mount: "/mnt/data",
            readOnly: false,
          },
        },
      },
    };

    data.profiles.compute[key] = {
      resources: {
        cpu: { units: 4 },
        memory: { size: "16Gi" },
        storage: [
          { size: "64Gi" },
          {
            name: "data",
            size: "10Gi",
            attributes: { persistent: true, class: "beta3" },
          },
        ],
        gpu: {
          units: 1,
          attributes: {
            vendor: {
              nvidia: [
                { model: "h100" },
                { model: "a100" },
                { model: "rtx4090" },
                { model: "rtx8000" },
                { model: "p100" },
                { model: "a6000" },
                { model: "v100" },
                { model: "rtx3090" },
                { model: "t4" },
                { model: "p40" },
              ],
            },
          },
        },
      },
    };

    data.profiles.placement[`global${i}`] = {
      pricing: {
        [key]: {
          denom: "uakt",
          amount: 10000,
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

  fs.writeFileSync("./src/routes/deploy/Mor-S-SDL-T2.yml", yamlStr, "utf8");

  console.log(`Generated YAML file with ${count} web entries.`);
}
