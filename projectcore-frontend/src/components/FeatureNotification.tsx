import React from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface FeatureNotificationProps {
  title: string;
  description: string;
  type: 'info' | 'warning' | 'coming-soon';
  actionLabel?: string;
  onAction?: () => void;
}

export default function FeatureNotification({
  title,
  description,
  type,
  actionLabel,
  onAction
}: FeatureNotificationProps) {
  return (
    <Alert 
      className={`
        ${type === 'info' ? 'border-blue-200 bg-blue-50' : ''}
        ${type === 'warning' ? 'border-amber-200 bg-amber-50' : ''}
        ${type === 'coming-soon' ? 'border-purple-200 bg-purple-50' : ''}
        my-4 animate-fadeIn
      `}
    >
      <div className="flex items-start">
        {type === 'info' && <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />}
        {type === 'warning' && <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />}
        {type === 'coming-soon' && (
          <div className="mr-2 mt-0.5">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
              Próximamente
            </Badge>
          </div>
        )}
        
        <div className="flex-1">
          <AlertTitle className={`
            ${type === 'info' ? 'text-blue-700' : ''}
            ${type === 'warning' ? 'text-amber-700' : ''}
            ${type === 'coming-soon' ? 'text-purple-700' : ''}
            font-medium
          `}>
            {title}
          </AlertTitle>
          <AlertDescription className={`
            ${type === 'info' ? 'text-blue-600' : ''}
            ${type === 'warning' ? 'text-amber-600' : ''}
            ${type === 'coming-soon' ? 'text-purple-600' : ''}
            text-sm
          `}>
            {description}
          </AlertDescription>
          
          {actionLabel && onAction && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAction}
              className={`
                mt-2
                ${type === 'info' ? 'border-blue-300 hover:bg-blue-100 text-blue-700' : ''}
                ${type === 'warning' ? 'border-amber-300 hover:bg-amber-100 text-amber-700' : ''}
                ${type === 'coming-soon' ? 'border-purple-300 hover:bg-purple-100 text-purple-700' : ''}
              `}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </Alert>
  );
}