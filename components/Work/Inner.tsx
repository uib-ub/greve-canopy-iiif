import {
  Label,
  Metadata,
  RequiredStatement,
  Summary,
} from "@samvera/nectar-iiif";
import { StyledWorkInner, WorkData } from "@/components/Work/Inner.styled";
import FACETS from "@/.canopy/facets";
import Link from "next/link";
import React from "react";
import Heading from "@/components/Shared/Heading/Heading";
import { DefinitionListWrapper } from "../Shared/DefinitionList.styled";

interface ValueAsListItemProps {
  searchParam: string;
  searchValues: [
    {
      value: string;
      slug: string;
      doc_count: number;
    }
  ];
  value?: string;
}

export const ValueAsListItem: React.FC<ValueAsListItemProps> = ({
  searchParam,
  searchValues,
  value,
}) => {
  if (!value) return <></>;
  const entry = searchValues?.find((entry) => entry.value === value);
  const search = `/search?${searchParam}=`;
  return (
    <Link href={search.concat(encodeURIComponent(entry?.slug as string))}>
      <span dangerouslySetInnerHTML={{ __html: value }}></span>
    </Link>
  );
};

const WorkInner = ({ manifest }) => {
  const { label, metadata, requiredStatement, summary } = manifest;

  const formattedValues = FACETS.map((value) => {
    return {
      Content: (
        <ValueAsListItem searchParam={value.slug} searchValues={value.values} />
      ),
      matchingLabel: { none: [value.label] },
    };
  });

  return (
    <StyledWorkInner>
      <WorkData>
        <Heading as="h1">
          <Label label={label} as="span" />
        </Heading>
        <Summary summary={summary} as="p" className="work-summary" />
        <DefinitionListWrapper>
          <Metadata customValueContent={formattedValues} metadata={metadata} />
          <RequiredStatement requiredStatement={requiredStatement} />
        </DefinitionListWrapper>
      </WorkData>
    </StyledWorkInner>
  );
};

export default WorkInner;
