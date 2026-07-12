'use client';

import { useState, useTransition } from 'react';
import { Archive, MoreVertical, Plus, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createProject, updateProjectStatus } from '@/actions/project-actions';
import { formatDate } from '@/lib/utils';
import type { ProjectListItem } from '@/types';

interface ProjectListProps {
  slug: string;
  projects: ProjectListItem[];
  canCreate: boolean;
  canArchive: boolean;
}

export function ProjectList({ slug, projects, canCreate, canArchive }: ProjectListProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createProject(slug, formData);
      if (result.success) {
        toast({ title: 'Project created', description: result.message });
        setOpen(false);
      } else {
        toast({
          title: 'Could not create project',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  }

  function handleToggleStatus(projectId: string, nextStatus: 'active' | 'archived') {
    startTransition(async () => {
      const result = await updateProjectStatus(slug, { projectId, status: nextStatus });
      if (!result.success) {
        toast({
          title: 'Could not update project',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Everything your team is currently shipping.</CardDescription>
        </div>
        {canCreate && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4" /> New project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form action={handleCreate} className="space-y-4">
                <DialogHeader>
                  <DialogTitle>Create a project</DialogTitle>
                  <DialogDescription>
                    Give your project a name your teammates will recognize.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Marketing site relaunch"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="What is this project about?"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? 'Creating...' : 'Create project'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No projects yet. Create your first one to get started.
          </p>
        ) : (
          <ul className="divide-y">
            {projects.map((project) => (
              <li key={project.id} className="flex items-center justify-between py-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{project.name}</p>
                    <Badge
                      variant={project.status === 'active' ? 'success' : 'secondary'}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  {project.description && (
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Created {formatDate(project.createdAt)}
                  </p>
                </div>
                {canArchive && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Project actions">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {project.status === 'active' ? (
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(project.id, 'archived')}
                        >
                          <Archive className="mr-2 h-4 w-4" /> Archive
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(project.id, 'active')}
                        >
                          <RotateCcw className="mr-2 h-4 w-4" /> Restore
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
