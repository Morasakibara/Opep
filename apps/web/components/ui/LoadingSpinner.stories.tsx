import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner, PageSkeleton } from './LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'UI/LoadingSpinner',
  component: LoadingSpinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'number', description: 'Taille du spinner en pixels' },
    text: { control: 'text', description: 'Texte affiché sous le spinner' },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingSpinner>;

export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: { size: 16, text: 'Chargement...' },
};

export const Large: Story = {
  args: { size: 48, text: 'Traitement en cours...' },
};

export const CustomText: Story = {
  args: { text: 'Synchronisation des données...' },
};

export const SkeletonView: StoryObj<typeof PageSkeleton> = {
  name: 'PageSkeleton',
  render: () => <PageSkeleton lines={6} />,
};
