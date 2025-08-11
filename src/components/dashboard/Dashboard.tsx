import React from 'react';
import { Users, Building, Calendar, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { Person, Space, Reservation } from '../../types';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { formatDate, formatTime, isDateInCurrentWeek } from '../../utils/dateHelpers';

interface DashboardStats {
  totalPersons: number;
  totalSpaces: number;
  totalReservations: number;
  todayReservations: number;
  thisWeekReservations: number;
}

interface DashboardProps {
  persons: Person[];
  spaces: Space[];
  reservations: Reservation[];
  isLoading?: boolean;
  onNavigate: (path: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  persons,
  spaces,
  reservations,
  isLoading = false,
  onNavigate,
}) => {
  const today = new Date().toISOString().split('T')[0];
  
  const stats: DashboardStats = {
    totalPersons: persons.length,
    totalSpaces: spaces.length,
    totalReservations: reservations.length,
    todayReservations: reservations.filter(r => r.reservationDate === today).length,
    thisWeekReservations: reservations.filter(r => isDateInCurrentWeek(r.reservationDate)).length,
  };

  const upcomingReservations = reservations
    .filter(r => {
      const reservationDate = new Date(r.reservationDate);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return reservationDate >= now;
    })
    .sort((a, b) => {
      const dateA = new Date(a.reservationDate + 'T' + a.startTime);
      const dateB = new Date(b.reservationDate + 'T' + b.startTime);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5);

  const busySpaces = spaces
    .map(space => ({
      ...space,
      reservationCount: reservations.filter(r => r.spaceId === space.id).length,
    }))
    .sort((a, b) => b.reservationCount - a.reservationCount)
    .slice(0, 3);

  const activeClients = persons
    .filter(p => p.role === 'client')
    .map(person => ({
      ...person,
      reservationCount: reservations.filter(r => r.personId === person.id).length,
    }))
    .sort((a, b) => b.reservationCount - a.reservationCount)
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your workspace reservation system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.totalPersons}</p>
              <p className="text-sm text-gray-500">Total People</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="mt-4 w-full"
            onClick={() => onNavigate('/persons')}
          >
            Manage People
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Building className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.totalSpaces}</p>
              <p className="text-sm text-gray-500">Total Spaces</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="mt-4 w-full"
            onClick={() => onNavigate('/spaces')}
          >
            Manage Spaces
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.totalReservations}</p>
              <p className="text-sm text-gray-500">Total Reservations</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="mt-4 w-full"
            onClick={() => onNavigate('/reservations')}
          >
            View All
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.todayReservations}</p>
              <p className="text-sm text-gray-500">Today's Bookings</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            {stats.thisWeekReservations} this week
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {reservations.length > 0 ? Math.round((stats.thisWeekReservations / reservations.length) * 100) : 0}%
              </p>
              <p className="text-sm text-gray-500">Week Activity</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Of all reservations
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Reservations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Reservations</h3>
            <p className="text-sm text-gray-500">Next 5 reservations</p>
          </div>
          <div className="p-6">
            {upcomingReservations.length === 0 ? (
              <div className="text-center py-4">
                <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No upcoming reservations</p>
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => onNavigate('/reservations')}
                >
                  Create Reservation
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingReservations.map((reservation) => (
                  <div key={reservation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {reservation.space?.name || `Space ${reservation.spaceId}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {reservation.person?.email || `Person ${reservation.personId}`}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(reservation.reservationDate, 'MMM d')} • {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {reservation.reservationDate === today ? 'Today' : 'Upcoming'}
                      </span>
                    </div>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => onNavigate('/reservations')}
                >
                  View All Reservations
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Popular Spaces & Active Clients */}
        <div className="space-y-8">
          {/* Popular Spaces */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Popular Spaces</h3>
              <p className="text-sm text-gray-500">Most frequently reserved spaces</p>
            </div>
            <div className="p-6">
              {busySpaces.length === 0 ? (
                <div className="text-center py-4">
                  <Building className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No spaces have reservations yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {busySpaces.map((space, index) => (
                    <div key={space.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">{space.name}</p>
                          <p className="text-sm text-gray-500">{space.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{space.reservationCount}</p>
                        <p className="text-xs text-gray-500">reservations</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active Clients */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Most Active Clients</h3>
              <p className="text-sm text-gray-500">Clients with most reservations</p>
            </div>
            <div className="p-6">
              {activeClients.length === 0 ? (
                <div className="text-center py-4">
                  <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No client activity yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeClients.map((person, index) => (
                    <div key={person.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${
                          index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-purple-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">{person.email}</p>
                          <p className="text-sm text-gray-500 capitalize">{person.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{person.reservationCount}</p>
                        <p className="text-xs text-gray-500">reservations</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={() => onNavigate('/reservations')} className="justify-center">
            <Calendar className="w-4 h-4 mr-2" />
            New Reservation
          </Button>
          <Button variant="outline" onClick={() => onNavigate('/persons')} className="justify-center">
            <Users className="w-4 h-4 mr-2" />
            Add Person
          </Button>
          <Button variant="outline" onClick={() => onNavigate('/spaces')} className="justify-center">
            <Building className="w-4 h-4 mr-2" />
            Add Space
          </Button>
        </div>
      </div>
    </div>
  );
};