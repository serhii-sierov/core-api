export interface ConnectionOptions {
  protocol?: string;
  username?: string;
  password?: string;
  host?: string;
  port?: number;
  database?: string;
}

export interface ParseOptions {
  includeProtocolName?: boolean;
}

export const parseConnectionString = (
  connectionString = '',
  { includeProtocolName = false }: ParseOptions = {},
): ConnectionOptions => {
  const regex =
    /(?<protocol>\w+):\/\/(?:(?<username>\w*)(?::(?<password>\w*))?@)?(?<host>[\w.-]+)(?::(?<port>\d+))?(?:\/(?<database>[\w-]+))?/;

  const match = regex.exec(connectionString)?.groups;

  if (!match) {
    return {};
  }

  return Object.entries(match).reduce<ConnectionOptions>((acc, [key, value]) => {
    if (!value) {
      return acc;
    }

    if (key === 'port') {
      acc[key] = parseInt(value, 10);
    } else if (key !== 'protocol' || includeProtocolName) {
      acc[key] = value;
    }

    return acc;
  }, {});
};
