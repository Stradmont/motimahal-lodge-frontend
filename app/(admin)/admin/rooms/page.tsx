'use client';

import React, { useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
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

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<RoomItem[]>(mockRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [toast, setToast] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [type, setType] = useState<RoomItem['type']>('Deluxe');
  const [price, setPrice] = useState('5000');
  const [capacity, setCapacity] = useState('2');
  const [imageUrl, setImageUrl] = useState('');

  const filteredRooms = rooms.filter((room) => {
    const matchesType = filterType === 'All' || room.type === filterType;
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

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

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const newRoom: RoomItem = {
      id: `RM-10${rooms.length + 1}`,
      name,
      type,
      pricePerNight: parseInt(price),
      capacity: parseInt(capacity),
      status: 'available',
      amenities: ['Free WiFi', 'AC', 'Breakfast Included'],
      imageUrl:
        imageUrl ||
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    };

    setRooms([newRoom, ...rooms]);
    setIsAddModalOpen(false);
    setName('');
    showToast('Room entry created');
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 text-zinc-50 border border-zinc-700 px-4 py-2 rounded-sm text-sm font-medium shadow-md">
          {toast}
        </div>
      )}

      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Rooms & Rates Inventory
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage lodge room categories, nightly rates, capacity, and availability status.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Room
        </Button>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-1">
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          {['All', 'Deluxe', 'Suite', 'Family', 'Standard'].map((t) => (
            <Button
              key={t}
              variant={filterType === t ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilterType(t)}
              className="text-xs h-8"
            >
              {t}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter room name..."
            className="pl-8 h-8 text-sm bg-white dark:bg-zinc-950"
          />
        </div>
      </div>

      {/* 3. Main Data Table */}
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

      {/* 4. Add Room Modal Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <form onSubmit={handleAddRoom} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add Room Entry</DialogTitle>
            <DialogDescription>
              Create a new room in the lodge inventory system.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Room Title
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Royal Riverside Villa"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Category
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as RoomItem['type'])}
                  className="w-full h-9 rounded-sm border border-zinc-300 bg-white px-3 py-1 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 focus:outline-none"
                >
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Family">Family</option>
                  <option value="Standard">Standard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Rate per Night (NPR)
                </label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Image URL
              </label>
              <Input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
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
