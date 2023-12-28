import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const object2ArrayExcludes = [];

export class Config {
  constructor(properties) {
    this.addAll(properties);
  }

  public get(key: string): any {
    return this[key];
  }

  public addAll(properties): any {
    properties = objectToArray(properties, object2ArrayExcludes);
    for (const property in properties) {
      if (properties.hasOwnProperty(property)) {
        this[property] = properties[property];
      }
    }
    this.postProcess();
  }

  public postProcess(): any {
    const variables = { ...this, ...process.env };
    for (const property in this) {
      if (this.hasOwnProperty(property)) {
        const value = this[property];
        const processedValue = this.processTemplate(value, variables);
        this[property] = processedValue;
      }
    }
  }

  private processTemplate(template, variables): any {
    if (typeof template === 'string') {
      return template.replace(
        new RegExp('\\${[^{]+}', 'g'),
        (name) => variables[name.substring(2, name.length - 1)],
      );
    }
    return template;
  }
}

const yamlConfigPath = path.join(__dirname, 'config', 'application.yml');
export const envYamlConfigPathApplication = path.join(
  __dirname,
  'config',
  `application-${process.env.NODE_ENV}.yml`,
);

export const liveYamlConfigPath = path.join(
  __dirname,
  '..',
  'liveconfig',
  `application-${process.env.NODE_ENV}.yml`,
);

const yamlConfig = yaml.load(fs.readFileSync(yamlConfigPath, 'utf8'));
const envYamlConfigApplication = yaml.load(fs.readFileSync(envYamlConfigPathApplication, 'utf8'));

let liveYamlConfig = {};
if (fs.existsSync(liveYamlConfigPath)) {
  liveYamlConfig = yaml.load(fs.readFileSync(liveYamlConfigPath, 'utf8'));
}

const objectToArray = (source, excludes?: string[], currentKey?, target?): any => {
  target = target || {};
  for (const property in source) {
    if (source.hasOwnProperty(property)) {
      const newKey = currentKey ? currentKey + '.' + property : property;
      const newVal = source[property];
      if (excludes && excludes.includes(newKey)) {
        target[newKey] = newVal;
        continue;
      }
      if (typeof newVal === 'object') {
        objectToArray(newVal, excludes, newKey, target);
      } else {
        target[newKey] = newVal;
      }
    }
  }
  return target;
};

//application level config
const config = new Config({
  ...objectToArray(yamlConfig, object2ArrayExcludes),
  ...objectToArray(envYamlConfigApplication, object2ArrayExcludes),
  ...objectToArray(liveYamlConfig, object2ArrayExcludes),
});

export { config };
