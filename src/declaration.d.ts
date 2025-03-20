type findLayerType = "districts" | "naslegs" | "poi" | "po378" | "dwc";

interface MapComponentContainerProps {
  activeLayer?: findLayerType; // Какой слой отоборажается в ед. виде
  find?: { type: "districts" | "naslegs" | "poi" | "po378"; id: number }; // Используем в списках объектов
  materialId?: string; // id нужного материала из списка пространственных материалов
  type?: "default" | "spatial" | "create" | "edit" | "view" | "create-poi" | "view-poi" | "edit-poi" | "spatial-data"; // где используется карта
  onFindMaterials?: (data: any) => void; // используется в SpartialSearch
  onSetGeometry?: (coordinates: any) => void;
  onDrawed?: (data: any) => void; // через функцию onDrawed отправляем FeatureCollection
  onDrawedCenter?: (data: [number, number]) => void;
  geometry?: any; // передаем FeatureCollection
  poiCoordinates?: any;
  coordinates?: [number, number]; // Передаем если получаем приватную точку в view-point или edit-point
}

declare module "MapProvider/MapComponentContainer" {
	export const MapComponentContainer: React.ComponentType<MapComponentContainerProps>;
	export default MapComponentContainer;
}
