'use client';

import React, { useState } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import AdminFilterBar from '@/components/admin/layout/AdminFilterBar';

interface RoomItem {
  id: string;
  name: string;
  type: 'Deluxe' | 'Suite' | 'Standard' | 'Family';
  pricePerNight: number;
  capacity: number;
  status: 'available' | 'occupied' | 'maintenance';
  amenities: string[];
  imageUrl: string;
}

const mockRooms: RoomItem[] = [
  {
    id: 'RM-101',
    name: 'River View Deluxe Suite',
    type: 'Suite',
    pricePerNight: 8500,
    capacity: 2,
    status: 'available',
    amenities: ['River Balcony', 'AC', 'Free WiFi', 'Breakfast'],
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'RM-102',
    name: 'Heritage Garden Double Room',
    type: 'Deluxe',
    pricePerNight: 5500,
    capacity: 2,
    status: 'occupied',
    amenities: ['Garden View', 'AC', 'Free WiFi', 'Flat TV'],
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'RM-103',
    name: 'Executive Family Cottage',
    type: 'Family',
    pricePerNight: 12000,
    capacity: 5,
    status: 'available',
    amenities: ['2 Bedrooms', 'Living Room', 'Patio'],
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'RM-104',
    name: 'Standard Cozy Twin Room',
    type: 'Standard',
    pricePerNight: 3800,
    capacity: 2,
    status: 'maintenance',
    amenities: ['Twin Beds', 'Free WiFi', 'Hot Shower'],
    imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
  },
];

const roomSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Room title is required' })
    .min(2, { message: 'Room title must be at least 2 characters' }),
  type: z.enum(['Deluxe', 'Suite', 'Family', 'Standard']),
  pricePerNight: z
    .string()
    .trim()
    .min(1, { message: 'Rate per night is required' })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Rate per night must be a valid positive number',
    }),
  capacity: z
    .string()
    .trim()
    .min(1, { message: 'Guest capacity is required' })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Capacity must be a valid positive number',
    }),
  imageUrl: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: 'Please enter a valid URL (starting with http:// or https://)',
    }),
});

type RoomFormData = z.infer<typeof roomSchema>;

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<RoomItem[]>(mockRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [toast, setToast] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: '',
      type: 'Deluxe',
      pricePerNight: '5000',
      capacity: '2',
      imageUrl: '',
    },
    mode: 'onBlur',
  });

  const filteredRooms = rooms.filter((room) => {
    const matchesType = filterType === 'All' || room.type === filterType;
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const filterOptions = [
    { key: 'All', label: 'All' },
    { key: 'Deluxe', label: 'Deluxe' },
    { key: 'Suite', label: 'Suite' },
    { key: 'Family', label: 'Family' },
    { key: 'Standard', label: 'Standard' },
  ];

  const handleToggleStatus = (id: string) => {
    setRooms(
      rooms.map((room) => {
        if (room.id === id) {
          const nextStatus: RoomItem['status'] =
            room.status === 'available'
              ? 'occupied'
              : room.status === 'occupied'
              ? 'maintenance'
              : 'available';
          return { ...room, status: nextStatus };
        }
        return room;
      })
    );
    showToast('Room status updated');
  };

  const handleDeleteRoom = (id: string) => {
    setRooms(rooms.filter((r) => r.id !== id));
    showToast('Room deleted from inventory');
  };

  const onAddRoomSubmit = (data: RoomFormData) => {
    const newRoom: RoomItem = {
      id: `RM-10${rooms.length + 1}`,
      name: data.name,
      type: data.type,
      pricePerNight: parseInt(data.pricePerNight),
      capacity: parseInt(data.capacity),
      status: 'available',
      amenities: ['Free WiFi', 'AC', 'Breakfast Included'],
      imageUrl:
        data.imageUrl ||
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    };

    setRooms([newRoom, ...rooms]);
    setIsAddModalOpen(false);
    reset();
    showToast('Room entry created successfully');
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 text-zinc-50 border border-zinc-700 px-4 py-2 rounded-sm text-sm font-medium shadow-md">
          {toast}
        </div>
      )}

      {/* Reusable Page Header */}
      <AdminPageHeader
        title="Rooms & Rates Inventory"
        description="Manage lodge room categories, nightly rates, capacity, and availability status."
        action={
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-sm h-9"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Room
          </Button>
        }
      />

      {/* Reusable Control & Search Bar */}
      <AdminFilterBar
        filterOptions={filterOptions}
        activeFilter={filterType}
        onFilterChange={setFilterType}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Filter room name..."
      />

      {/* Main Data Table */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-sm bg-white dark:bg-zinc-950 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room Details</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Nightly Rate</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={room.imageUrl}
                      alt={room.name}
                      className="w-12 h-9 object-cover rounded-sm border border-zinc-200 dark:border-zinc-800 shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                        {room.name}
                      </p>
                      <span className="text-xs text-zinc-500 font-mono">
                        {room.id}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {room.type}
                  </Badge>
                </TableCell>

                <TableCell className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  NPR {room.pricePerNight.toLocaleString()}
                </TableCell>

                <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                  {room.capacity} Guests
                </TableCell>

                <TableCell>
                  {room.status === 'available' && (
                    <Badge variant="default">Available</Badge>
                  )}
                  {room.status === 'occupied' && (
                    <Badge variant="secondary">Occupied</Badge>
                  )}
                  {room.status === 'maintenance' && (
                    <Badge variant="destructive">Maintenance</Badge>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(room.id)}
                      className="h-8 text-xs px-2.5"
                    >
                      Cycle Status
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteRoom(room.id)}
                      className="h-8 w-8"
                      title="Delete room"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Room Modal Dialog - Spacious size="3xl" */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen} size="3xl">
        <form onSubmit={handleSubmit(onAddRoomSubmit)} noValidate className="space-y-4 font-sans">
          <DialogHeader>
            <DialogTitle>Add Room Entry</DialogTitle>
            <DialogDescription>
              Create a new room in the lodge inventory system.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Room Title <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                {...register('name')}
                placeholder="e.g. Royal Riverside Villa"
                className={errors.name ? 'border-rose-500 focus-visible:ring-rose-500' : ''}
              />
              {errors.name && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register('type')}
                  className="w-full h-9 rounded-sm border border-zinc-300 bg-white px-3 py-1 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 focus:outline-none font-sans"
                >
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Family">Family</option>
                  <option value="Standard">Standard</option>
                </select>
                {errors.type && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Rate per Night (NPR) <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="number"
                  {...register('pricePerNight')}
                  placeholder="5000"
                  className={errors.pricePerNight ? 'border-rose-500 focus-visible:ring-rose-500' : ''}
                />
                {errors.pricePerNight && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.pricePerNight.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Guest Capacity <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="number"
                  {...register('capacity')}
                  placeholder="2"
                  className={errors.capacity ? 'border-rose-500 focus-visible:ring-rose-500' : ''}
                />
                {errors.capacity && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.capacity.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Image URL (Optional)
              </label>
              <Input
                type="url"
                {...register('imageUrl')}
                placeholder="https://images.unsplash.com/..."
                className={errors.imageUrl ? 'border-rose-500 focus-visible:ring-rose-500' : ''}
              />
              {errors.imageUrl && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.imageUrl.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Room
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
