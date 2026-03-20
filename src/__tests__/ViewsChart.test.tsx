import { render, screen } from '@testing-library/react';
import ViewsChart from '@/shared/ui/ViewsChart';

describe('ViewsChart', () => {
  it('affiche le titre et une valeur issue de la série partagée', () => {
    render(<ViewsChart />);
    expect(screen.getByText('Vues totales')).toBeInTheDocument();
    const hits = screen.getAllByText('14.7M');
    expect(hits.length).toBeGreaterThanOrEqual(1);
  });

  it('accepte une série personnalisée', () => {
    render(
      <ViewsChart
        series={[
          { month: 'A', value: 100 },
          { month: 'B', value: 200 },
        ]}
        subtitle="Test"
      />,
    );
    expect(screen.getAllByText('200').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
