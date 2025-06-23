import React from "react";
import { cn } from "@/lib/utils";
import { FileText, Calendar, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PageHeaderProps {
  title: string;
  description?: string;
  imgSrc?: string;
  className?: string;
  date?: string;
}

export function PageHeader({
  title,
  description,
  imgSrc,
  className,
  date = "२०८०-०३-१५",
}: PageHeaderProps) {
  return (
    <div className={cn("relative rounded-lg overflow-hidden mb-8", className)}>
      {imgSrc && (
        <>
          <img
            src={imgSrc}
            alt={title}
            className="w-full h-[250px] object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
            <div className="p-6 text-white max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">{title}</h1>
              {description && (
                <p className="text-base sm:text-lg opacity-90 sm:max-w-xl">
                  {description}
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {!imgSrc && (
        <div className="bg-muted rounded-lg px-6 py-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{title}</h1>
          {description && (
            <p className="text-muted-foreground text-lg max-w-3xl">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <FileText className="h-4 w-4" />
          <span>तथ्याङ्क प्रोफाइल</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span>अपडेट मिति: {date}</span>
        </div>

        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <Share2 className="h-4 w-4" />
                <span>शेयर</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>शेयर गर्नुहोस्</DropdownMenuLabel>
              <DropdownMenuItem>Facebook मा शेयर</DropdownMenuItem>
              <DropdownMenuItem>Twitter मा शेयर</DropdownMenuItem>
              <DropdownMenuItem>लिंक कपी गर्नुहोस्</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
