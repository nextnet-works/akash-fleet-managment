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
    gpu?: { units: number; attributes: { vendor: { nvidia: string } } };
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
  deployment: { [key: string]: WebDeployment };
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
              nvidia:
                "H100,A100,RTX 4090,RTX 8000,P100,A6000,V100,RTX 3090,T4,P40",
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

    data.deployment[key] = {
      profile: key,
      count: 1,
    };
  }

  const yamlStr = YAML.stringify(data);

  fs.writeFileSync("./src/routes/deploy/Mor-S-SDL-T2.yml", yamlStr, "utf8");

  console.log(`Generated YAML file with ${count} web entries.`);
}
