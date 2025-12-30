import { useState } from 'react';
import { X, User, Phone, Mail, Calendar, CreditCard, Clock, LogOut } from 'lucide-react';
import { Resident } from '@/types/hostel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useHostel } from '@/context/HostelContext';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ResidentInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  resident: Resident;
}

export function ResidentInfoModal({ isOpen, onClose, resident }: ResidentInfoModalProps) {
  const { vacateBed, properties } = useHostel();
  const { toast } = useToast();
  const [showVacateDialog, setShowVacateDialog] = useState(false);

  if (!isOpen) return null;

  // Get room number from properties
  const getRoomNumber = (): string => {
    const property = properties.find(p => p.id === resident.propertyId);
    if (!property) return resident.roomId;
    
    for (const floor of property.floors) {
      const room = floor.rooms.find(r => r.id === resident.roomId);
      if (room) return room.number;
    }
    return resident.roomId;
  };

  const roomNumber = getRoomNumber();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="badge badge-success">Paid</span>;
      case 'pending':
        return <span className="badge badge-warning">Pending</span>;
      case 'overdue':
        return <span className="badge badge-destructive">Overdue</span>;
      default:
        return null;
    }
  };

  const handleVacateBed = () => {
    vacateBed(resident.bedId);
    toast({
      title: 'Bed Vacated',
      description: `${resident.name} has been removed from Room ${roomNumber}. The bed is now available.`,
    });
    setShowVacateDialog(false);
    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div 
        className="modal-content w-full max-w-lg animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-foreground">Resident Details</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {resident.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">{resident.name}</h3>
              <p className="text-muted-foreground">Age: {resident.age} years</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground uppercase tracking-wide">Contact Information</h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-foreground">{resident.contactNumber}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-foreground">{resident.email}</span>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground uppercase tracking-wide">Emergency Contact</h4>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="font-medium text-foreground">{resident.emergencyContactName}</p>
              <p className="text-muted-foreground">{resident.emergencyContact}</p>
            </div>
          </div>

          {/* Lease Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground uppercase tracking-wide">Lease Details</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Start Date</span>
                </div>
                <p className="font-medium text-foreground">{formatDate(resident.startDate)}</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">End Date</span>
                </div>
                <p className="font-medium text-foreground">{formatDate(resident.endDate)}</p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground uppercase tracking-wide">Payment Information</h4>
            <div className="p-4 bg-muted/30 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Monthly Rent</span>
                </div>
                <span className="font-semibold text-foreground">₹{resident.monthlyRent.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Billing Frequency</span>
                </div>
                <span className="font-medium text-foreground capitalize">{resident.billingFrequency}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment Status</span>
                {getPaymentStatusBadge(resident.paymentStatus)}
              </div>
              {resident.lastPaymentDate && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Payment</span>
                  <span className="text-foreground">{formatDate(resident.lastPaymentDate)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border flex gap-3">
          <Button
            onClick={() => setShowVacateDialog(true)}
            variant="destructive"
            className="flex-1"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Vacate Bed
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1">
            Close
          </Button>
        </div>
      </div>

      {/* Vacate Bed Confirmation Dialog */}
      <AlertDialog open={showVacateDialog} onOpenChange={setShowVacateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will vacate the bed for <strong>{resident.name}</strong> in Room {roomNumber}. 
              The bed will be marked as available and the resident data will be removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleVacateBed}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Vacate Bed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
