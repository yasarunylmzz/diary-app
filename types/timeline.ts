interface Frame {
  uri: string;
  timestamp: number;
}

interface TimelineProps {
  frames: Frame[];
  onUpdateSelection: (position: number) => void;
  onUpdateFrames?: (frames: string[]) => void;
  videoDuration: number;
  initialPosition?: number;
  videoSource?: string;
}
