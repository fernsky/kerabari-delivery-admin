import { customType } from "drizzle-orm/pg-core";

// Helper function for PostGIS geometry types
export const postgis = (name: string) => 
  customType<{ data: string | [number, number] }>({
    dataType() {
      return 'geometry(Point, 4326)';
    },
    toDriver(value) {
      const data = value;
      if (typeof data === 'string') return data;
      if (Array.isArray(data) && data.length === 2) {
        const [lng, lat] = data;
        return `SRID=4326;POINT(${lng} ${lat})`;
      }
      return null;
    }
  })(name);
