import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './components/ui/card';
import {
  Chart,
  ChartBar,
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from './components/ui/chart';

interface DepartmentData {
  name: string;
  budget: number;
  spent: number;
  employees: number;
}

interface DashboardProps {
  departmentId?: string;
}

const DepartmentalDashboard: React.FC<DashboardProps> = ({ departmentId }) => {
  const [data, setData] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate fetching department data
    const fetchData = async () => {
      setLoading(true);
      try {
        // Placeholder for API call
        const mockData: DepartmentData[] = [
          { name: 'Engineering', budget: 100000, spent: 75000, employees: 25 },
          { name: 'Marketing', budget: 50000, spent: 40000, employees: 10 },
          { name: 'Sales', budget: 75000, spent: 60000, employees: 15 },
        ];
        setData(mockData);
      } catch (error) {
        console.error('Error fetching department data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [departmentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="departmental-dashboard">
      <Card>
        <CardHeader>
          <CardTitle>Departmental Dashboard</CardTitle>
          <CardDescription>Overview of department metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer>
            <Chart>
              {data.map((dept) => (
                <ChartBar
                  key={dept.name}
                  name={dept.name}
                  budget={dept.budget}
                  spent={dept.spent}
                  employees={dept.employees}
                />
              ))}
            </Chart>
            <ChartTooltip />
            <ChartLegend />
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentalDashboard;
