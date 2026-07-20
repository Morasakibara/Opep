import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'danger', 'info', 'default'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Success: Story = {
  args: { variant: 'success', label: 'Actif' },
};

export const Warning: Story = {
  args: { variant: 'warning', label: 'En attente' },
};

export const Danger: Story = {
  args: { variant: 'danger', label: 'Annulé' },
};

export const Info: Story = {
  args: { variant: 'info', label: 'Info' },
};

export const DefaultVariant: Story = {
  args: { variant: 'default', label: 'Brouillon' },
};

export const MediumSize: Story = {
  args: { variant: 'info', label: 'En cours', size: 'md' },
};
