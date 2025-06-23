
import { Plus, Image, Link, Table, Calendar, MapPin, Hash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface InsertMenuProps {
  onInsert: (content: string) => void;
}

const InsertMenu = ({ onInsert }: InsertMenuProps) => {
  const insertOptions = [
    {
      label: 'Image',
      icon: Image,
      action: () => {
        const imageUrl = prompt('Enter image URL:');
        if (imageUrl) {
          onInsert(`\n![Image](${imageUrl})\n`);
        }
      }
    },
    {
      label: 'Link',
      icon: Link,
      action: () => {
        const url = prompt('Enter URL:');
        const text = prompt('Enter link text:') || url;
        if (url) {
          onInsert(`[${text}](${url})`);
        }
      }
    },
    {
      label: 'Table',
      icon: Table,
      action: () => {
        const tableMarkdown = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;
        onInsert(tableMarkdown);
      }
    },
    {
      label: 'Date',
      icon: Calendar,
      action: () => {
        const today = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        onInsert(today);
      }
    },
    {
      label: 'Location',
      icon: MapPin,
      action: () => {
        const location = prompt('Enter location:');
        if (location) {
          onInsert(`📍 ${location}`);
        }
      }
    },
    {
      label: 'Tag',
      icon: Hash,
      action: () => {
        const tag = prompt('Enter tag name:');
        if (tag) {
          onInsert(`#${tag.replace(/\s+/g, '')} `);
        }
      }
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 px-4 py-2 bg-navy-800 text-white rounded-lg hover:bg-navy-700 transition-all">
          <Plus size={16} />
          <span>Insert</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white border border-slate-200">
        {insertOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <DropdownMenuItem
              key={option.label}
              onClick={option.action}
              className="hover:bg-slate-100 text-slate-700"
            >
              <IconComponent size={16} className="mr-2" />
              {option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InsertMenu;
