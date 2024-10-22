import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface IProps {
    label?: string;
    palceHolder?: string;
    onSelectDate?: (date: Date | undefined) => void;
    selectedDate: Date | undefined;
    className?: string;
}

export default function DatePicker({
    label,
    onSelectDate,
    selectedDate,
    palceHolder,
    className,
}: Readonly<IProps>) {
    return (
        <div className='space-y-8'>
            {label && (
                <div className='flex flex-col'>
                    <label>{label}</label>
                </div>
            )}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        className={cn(
                            'md:max-w-52 w-full  inline-flex  items-center gap-2 pl-3 text-left font-normal',
                            !selectedDate && 'text-muted-foreground',
                            className,
                        )}
                    >
                        {selectedDate ? (
                            format(selectedDate, 'PPP')
                        ) : (
                            <span>{palceHolder ?? 'Pick a date'}</span>
                        )}
                        <CalendarIcon className='h-4 w-4 opacity-50' />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                        mode='single'
                        selected={selectedDate}
                        onSelect={onSelectDate}
                        defaultMonth={selectedDate}
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
