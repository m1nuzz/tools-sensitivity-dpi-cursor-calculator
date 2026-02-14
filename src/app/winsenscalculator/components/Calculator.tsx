"use client";

import s from "./Calculator.module.css";
import { Stack, NumberInput, Tooltip, Table } from "@mantine/core";
import React from "react";

const sensitivities = [
  [1 / 32, "1/32", "1"],
  [1 / 16, "1/16", "2"],
  [1 / 8, "1/8"],
  [2 / 8, "2/8", "3"],
  [3 / 8, "3/8"],
  [4 / 8, "4/8", "4"],
  [5 / 8, "5/8"],
  [6 / 8, "6/8", "5"],
  [7 / 8, "7/8"],
  [1, "1", "6"],
  [1.25, "1.25"],
  [1.5, "1.5", "7"],
  [1.75, "1.75"],
  [2, "2", "8"],
  [2.25, "2.25"],
  [2.5, "2.5", "9"],
  [2.75, "2.75"],
  [3, "3", "10"],
  [3.25, "3.25"],
  [3.5, "3.5", "11"],
];

function DisplayDPI({
  targetEdpi,
  multiplier,
}: {
  targetEdpi: number;
  multiplier: number;
}) {
  // Formula: RequiredDPI = Target_eDPI / New_Multiplier
  const dpi = targetEdpi / multiplier;

  if (Number.isInteger(dpi)) {
    return <Table.Td>{dpi}</Table.Td>;
  }

  return (
    <Tooltip label={`Exact: ${dpi.toString()}`}>
      <Table.Td>{`~${Math.round(dpi).toString()}`}</Table.Td>
    </Tooltip>
  );
}

export default function Calculator() {
  // State for the user's PHYSICAL mouse DPI
  const [mouseDPI, setMouseDPI] = React.useState<number>(1600);
  
  // State for the user's CURRENT Registry setting (1-20)
  const [registryValue, setRegistryValue] = React.useState<number>(10);

  // 1. Find the multiplier for the user's current setting
  // registryValue is 1-based, array is 0-based
  const currentMultiplier = sensitivities[Math.max(0, Math.min(19, registryValue - 1))][0] as number;

  // 2. Calculate the "True eDPI" (Effective DPI at 1.0 multiplier)
  // Example: 3200 DPI @ Reg 5 (0.375) = 1200 eDPI
  const effectiveDPI = mouseDPI * currentMultiplier;

  return (
    <Stack>
      <Tooltip
        label={`The physical DPI set in your mouse software.`}
      >
        <div>
          <NumberInput
            label="Current Mouse DPI"
            description="Enter the DPI value currently set on your mouse"
            value={mouseDPI}
            onChange={(value) => {
              if (typeof value === "number") {
                setMouseDPI(value);
              }
            }}
            min={1}
            max={10000000}
            clampBehavior="strict"
            allowNegative={false}
            allowDecimal={false}
            stepHoldDelay={250}
            stepHoldInterval={1}
          />
        </div>
      </Tooltip>

      <Tooltip label="HKEY_CURRENT_USER\Control Panel\Mouse -> MouseSensitivity (default is 10)">
        <div>
          <NumberInput
            label="Current Windows Sensitivity (1-20)"
            description="Your current registry value / pointer speed slider position"
            value={registryValue}
            onChange={(value) => {
              if (typeof value === "number") {
                setRegistryValue(value);
              }
            }}
            min={1}
            max={20}
            clampBehavior="strict"
            allowNegative={false}
            allowDecimal={false}
          />
        </div>
      </Tooltip>

      <Table striped withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th className={s.alignRight}>Required DPI</Table.Th>
            <Tooltip label="HKEY_CURRENT_USER\Control Panel\Mouse -> MouseSensitivity">
              <Table.Th className={s.alignRight}>
                *Registry / New Panel
              </Table.Th>
            </Tooltip>
            <Table.Th className={s.alignRight}>Legacy Panel</Table.Th>
            <Table.Th className={s.alignRight}>Multiplier</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sensitivities.map((row, index) => {
            const isCurrentRow = index + 1 === registryValue;
            return (
              <Table.Tr 
                key={row[1]} 
                className={s.alignRight}
                bg={isCurrentRow ? "var(--mantine-color-blue-light)" : undefined}
                style={isCurrentRow ? { fontWeight: "bold" } : undefined}
              >
                <DisplayDPI targetEdpi={effectiveDPI} multiplier={row[0] as number} />
                <Table.Td>{index + 1}</Table.Td>
                <Table.Td>{row[2]}</Table.Td>
                <Table.Td>{row[1]}</Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
