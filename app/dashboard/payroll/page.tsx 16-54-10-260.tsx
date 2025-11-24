"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { staffService } from "@/lib/services/staff-service"
import { Users, DollarSign, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Employee = {
  id: string
  employee_number: string
  position: string
  salary_type: string
  salary_amount: number
  hire_date: string
  employment_status: string
  profile_id: string | null
}

type Profile = {
  id: string
  full_name: string
  email: string
  role: string
}

export default function PayrollPage() {
  const [employees, setEmployees] = useState<(Employee & { profile: Profile | null })[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // New Employee Form
  const [formData, setFormData] = useState({
    employee_number: "",
    full_name: "", // In a real app, we'd link to existing profiles or create one
    email: "",
    position: "",
    salary_type: "monthly",
    salary_amount: "",
    hire_date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    // Fetch employees with their profile data
    const { data: employeesData } = await staffService.getEmployees()
    const { data: profilesData } = await staffService.getProfiles()

    if (employeesData && profilesData) {
      const combinedData = employeesData.map((emp: any) => ({
        ...emp,
        profile: profilesData.find((p: any) => p.id === emp.profile_id) || null,
      }))
      setEmployees(combinedData)
    }
  }

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await staffService.createEmployee({
        employee_number: formData.employee_number,
        position: formData.position,
        salary_type: formData.salary_type,
        salary_amount: Number.parseFloat(formData.salary_amount),
        hire_date: formData.hire_date,
        employment_status: "active",
        profile_id: null, // In this demo we don't link to a profile yet
      })

      if (error) throw error

      toast.success("Employee added successfully")
      setIsDialogOpen(false)
      fetchData()
    } catch (error) {
      console.error(error)
      toast.error("Failed to add employee")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payroll & Staff</h2>
          <p className="text-muted-foreground">Manage employees and process payroll</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground">Est. for this month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="employees" className="w-full">
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Runs</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Salary Type</TableHead>
                  <TableHead className="text-right">Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.employee_number}</TableCell>
                    <TableCell>{employee.profile?.full_name || "Unknown"}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>
                      <Badge variant={employee.employment_status === "active" ? "default" : "secondary"}>
                        {employee.employment_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{employee.salary_type}</TableCell>
                    <TableCell className="text-right">${employee.salary_amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {employees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No employees found. Add your first employee to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="payroll" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pay Period</TableHead>
                  <TableHead>Employees Paid</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No payroll runs recorded yet.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>Enter employee details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddEmployee} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="emp_id" className="text-right">
                Employee ID
              </Label>
              <Input
                id="emp_id"
                value={formData.employee_number}
                onChange={(e) => setFormData({ ...formData, employee_number: e.target.value })}
                className="col-span-3"
                placeholder="EMP-001"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Position
              </Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salary_type" className="text-right">
                Salary Type
              </Label>
              <Select
                value={formData.salary_type}
                onValueChange={(value) => setFormData({ ...formData, salary_type: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly Salary</SelectItem>
                  <SelectItem value="hourly">Hourly Rate</SelectItem>
                  <SelectItem value="daily">Daily Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                min="0"
                value={formData.salary_amount}
                onChange={(e) => setFormData({ ...formData, salary_amount: e.target.value })}
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Employee"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
