import type { Directive } from 'vue'
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  CirclePlus,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Palette,
  Pencil,
  Plus,
  RefreshCcw,
  Ruler,
  Search,
  Shapes,
  SquarePen,
  Trash2,
  X,
  createElement,
} from 'lucide'

const lucideIcons = {
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  boxes: Boxes,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'chevrons-up-down': ChevronsUpDown,
  'circle-plus': CirclePlus,
  edit: SquarePen,
  'edit-2': Pencil,
  'folder-tree': FolderTree,
  'layout-dashboard': LayoutDashboard,
  'log-out': LogOut,
  menu: Menu,
  package: Package,
  palette: Palette,
  plus: Plus,
  'refresh-ccw': RefreshCcw,
  ruler: Ruler,
  search: Search,
  shapes: Shapes,
  'trash-2': Trash2,
  x: X,
}

const renderIcon = (el: HTMLElement, iconName?: string) => {
  if (!iconName) {
    el.replaceChildren()
    return
  }

  const iconNode = lucideIcons[iconName as keyof typeof lucideIcons]

  if (!iconNode) {
    el.replaceChildren()
    return
  }

  const svg = createElement(iconNode, {
    width: '1em',
    height: '1em',
  })

  el.replaceChildren(svg)
}

export const lucideDirective: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    renderIcon(el, binding.value)
  },
  updated(el, binding) {
    renderIcon(el, binding.value)
  },
}
