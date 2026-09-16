import styled from "styled-components";
import { PartenaireStat } from "@/lib/api-stats";
import {
  CATEGORIES,
  CATEGORY_CONFIG,
  groupPartenairesByCategory,
} from "./charts/partenaires";

const SummaryRow = styled.div`
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin: 16px 0;
  padding: 24px 40px;
  border-radius: 8px;
  background-color: var(--background-alt-blue-france);
  border: 1px solid var(--border-default-grey);
`;

const Count = styled.p`
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.1;
  color: var(--text-title-blue-france);
`;

const Label = styled.p`
  margin: 0;
  font-size: 1.125rem;
  color: var(--text-default-grey);
`;

const Swatch = styled.span<{ color: string }>`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;

const CategoriesList = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px 24px;
  width: 100%;
  max-width: 900px;
  margin: 0 0 24px 0;
`;

const CategoryEntry = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CategoryLabel = styled.dt`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-default-grey);
`;

const CategoryCount = styled.dd`
  margin: 0 0 0 auto;
  font-weight: 700;
  color: var(--text-title-blue-france);
`;

interface PartenairesSummaryProps {
  partenaires: PartenaireStat[];
}

const PartenairesSummary = ({ partenaires }: PartenairesSummaryProps) => {
  const byCategory = groupPartenairesByCategory(partenaires || []);
  const total = CATEGORIES.reduce(
    (sum, category) => sum + byCategory[category].length,
    0,
  );

  if (total === 0) {
    return null;
  }

  return (
    <>
      <CategoriesList>
        {CATEGORIES.map((category) => (
          <CategoryEntry key={category}>
            <CategoryLabel>
              <Swatch color={CATEGORY_CONFIG[category].color} />
              {CATEGORY_CONFIG[category].label}
            </CategoryLabel>
            <CategoryCount>{byCategory[category].length}</CategoryCount>
          </CategoryEntry>
        ))}
      </CategoriesList>

      <SummaryRow>
        <Card>
          <Count>{total.toLocaleString("fr-FR")}</Count>
          <Label>partenaires de la charte</Label>
        </Card>
      </SummaryRow>
    </>
  );
};

export default PartenairesSummary;
