
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const RealEstateInterestForm: React.FC = () => {
  const { t } = useLanguage();
  
  const formSchema = z.object({
    name: z.string().min(2, { message: t('form.name-required') }),
    email: z.string().email({ message: t('form.invalid-email') }),
    phone: z.string().min(8, { message: t('form.invalid-phone') }),
    interest: z.enum(['alquiler', 'compra', 'informacion'], {
      required_error: t('form.select-interest'),
    }),
    message: z.string().optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      interest: 'informacion',
      message: '',
    },
  });

  function onSubmit(values: FormValues) {
    toast({
      title: t('form.sent-title'),
      description: t('form.sent-desc'),
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.full-name')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('form.your-name')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.email')}</FormLabel>
                <FormControl>
                  <Input placeholder="tu@email.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.phone')}</FormLabel>
              <FormControl>
                <Input placeholder="+54 11 1234 5678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="interest"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{t('form.interested-in')}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="alquiler" id="alquiler" />
                    <FormLabel htmlFor="alquiler" className="font-normal cursor-pointer">
                      {t('form.rent-property')}
                    </FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="compra" id="compra" />
                    <FormLabel htmlFor="compra" className="font-normal cursor-pointer">
                      {t('form.buy-property')}
                    </FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="informacion" id="informacion" />
                    <FormLabel htmlFor="informacion" className="font-normal cursor-pointer">
                      {t('form.receive-info')}
                    </FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.additional-message')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('form.additional-placeholder')}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="bg-AFJPCripto-gradient hover:opacity-90 w-full">
          {t('form.send-request')}
        </Button>
      </form>
    </Form>
  );
};

export default RealEstateInterestForm;
