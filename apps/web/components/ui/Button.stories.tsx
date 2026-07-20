import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { ArrowRight, Trash2, Save } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
      description: 'Style visuel du bouton',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
      description: 'Taille du bouton',
    },
    isLoading: {
      control: 'boolean',
      description: 'Affiche un spinner de chargement',
    },
    disabled: {
      control: 'boolean',
      description: 'Désactive le bouton',
    },
    leftIcon: { table: { disable: true } },
    rightIcon: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Valider',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Annuler',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Voir plus',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Modifier',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Supprimer',
    leftIcon: <Trash2 size={16} />,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Chargement...',
  },
};

export const WithIcons: Story = {
  args: {
    leftIcon: <Save size={16} />,
    rightIcon: <ArrowRight size={16} />,
    children: 'Enregistrer & continuer',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Indisponible',
  },
};

export const SizeSmall: Story = {
  args: {
    size: 'sm',
    children: 'Petit',
  },
};

export const SizeLarge: Story = {
  args: {
    size: 'lg',
    children: 'Grand bouton',
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Bouton large',
    className: 'w-full',
  },
};
