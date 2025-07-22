import { ReactNode } from 'react';
import { SVGAttributes } from 'react';

export interface IconToken {
  title: string;
  asset: ReactNode;
  attr?: SVGAttributes<SVGElement>;
}
