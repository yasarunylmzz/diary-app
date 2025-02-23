export type VideoNote = {
  id: number;
  name: string;
  description: string;
  filePath: string;
  createdAt: string;
  tags: tags[];
  duration: number;
};

export type TextNote = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  tags: tags[];
};

export type tags = {
  id: number;
  name: string;
};
