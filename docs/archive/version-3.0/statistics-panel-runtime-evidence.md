# Production Statistics Runtime Evidence

**Archived:** Moved to historical evidence on 2026-08-27 after dead screenshot
embeds and the stale Git-state claim were removed. The retained text records
the observed runtime investigation.

Established against Dyson Sphere Program Early Access `0.10.34.28529`, Steam
build ID `23109513`, using Unity `2022.3.62f3c1`. The game was observed live,
then closed.

## Evidence basis

Primary evidence was:

- Live observation of the installed game and its observed UI.
- English localization from the observed build in [base.txt](<C:/Program Files (x86)/Steam/steamapps/common/Dyson Sphere Program/Locale/1033/base.txt:1864>) and [keys.txt](<C:/Program Files (x86)/Steam/steamapps/common/Dyson Sphere Program/Locale/1033/keys.txt:113>).
- Read-only decompilation of [Assembly-CSharp.dll](<C:/Program Files (x86)/Steam/steamapps/common/Dyson Sphere Program/DSPGAME_Data/Managed/Assembly-CSharp.dll>), principally:
  - `UIStatisticsWindow`
  - `UIProductEntry`
  - `UIProductEntryList`
  - `ProductionExtraInfoCalculator`
  - `UIReferenceSpeedTip`
- Installed-version records in [Versions.txt](<C:/Program Files (x86)/Steam/steamapps/common/Dyson Sphere Program/Updates/Versions.txt:148>) and [appmanifest_1366540.acf](<C:/Program Files (x86)/Steam/steamapps/appmanifest_1366540.acf>).

Official patch notes were unnecessary because the observed runtime and
localization directly established the behavior.

## Opening the panel

- Default key: `P`.
- UI route: the bar-chart Statistics button at the bottom-right of the normal game HUD.
- The resulting window is visibly titled `Statistics Panel (P)`.
- Select the `Production` tab. `Dashboard (SHIFT + P)` is a separate top-level view, not the production-statistics tab.

## Location scopes

The production dropdown contains these scope types:

| Exact visible form | Included production/consumption | Import/export boundary |
|---|---|---|
| `Entire star cluster` | Every loaded factory in the cluster | No traffic-stat group is added. Import/export therefore remains zero: there is nothing outside the cluster boundary. |
| `Local planet` | The current planet’s single factory | Traffic crossing that planet’s boundary. |
| `<star name> System`, for example `70 Lyncis System` | All factory-bearing planets in that system | Traffic crossing the system boundary. Movement between planets inside the system is internal, not system import/export. |
| A planet’s display name, for example `70 Lyncis III` | That planet’s factory | Traffic crossing that planet’s boundary. |

Only systems containing at least one factory appear; within them, only planets with a factory appear. The current save visibly included entries such as `70 Lyncis I`, `70 Lyncis II`, `70 Lyncis III`, `70 Lyncis IV`, `Edasich II`, and `Beta Antliae III`.

Although `Local planetary system` exists in localization, the current Production dropdown does not create that generic entry. It creates the actual named `<star> System` entry instead.

## Time intervals and units

Exact choices:

- `1 minute`
- `10 minutes`
- `1 hour`
- `10 hours`
- `100 hours`
- `Total`

For the first five choices, production, consumption, import, and export are rolling-window totals divided into average rates per minute:

- 1 minute: last 60 seconds ÷ 1
- 10 minutes: last 10 minutes ÷ 10
- 1 hour: last hour ÷ 60
- 10 hours: last 10 hours ÷ 600
- 100 hours: last 100 hours ÷ 6,000

They are therefore historical per-minute averages, not interval totals and not instantaneous rates.

`Total` changes the labels to `Total production`, `Total consumption`, `Total import`, and `Total export`, and displays cumulative item counts without `/min`.

## What one item row shows

Every normal row contains:

- Item icon and name.
- Six favorite-category stars.
- `Production Rate`.
- Production `Reference Rate`.
- `Consumption Rate`.
- Consumption `Reference Rate`.
- `Import Rate`.
- `Export Rate`.
- `Import Storage`.
- `Export Storage`.
- `Storage Amount`.
- `Litter Amount`.
- A time graph:
  - cyan upper bars: production/import;
  - orange lower bars: consumption/export.
- Buttons for `Raw Material Statistics` and `Product Statistics`.

Representative live Electromagnetic Matrix row at `Local planet`, `10 minutes`:

- Production: `140.0 / min`
- Consumption: rolling value; `17.5 / min` in the historical screenshot
- Production Reference Rate: `140 / min`
- Consumption Reference Rate: `0 / min`
- Import Rate: `0 / min`
- Export Rate: `0 / min`
- Import Storage: `0`
- Export Storage: `0`
- Storage Amount: `13,847` in the storage-tooltip screenshot
- Litter Amount: `0`

Those numbers are save- and time-dependent; the field set and calculation behavior are the verified contract.

## Reference Rate

Exact localization explanation:

> Based on the factory layout, connection to the power grid, and usage of proliferators, calculate the reference rate under ideal conditions.

Plain factual meaning: Reference Rate is the configured ideal throughput of applicable facilities inside the selected scope. It is capacity inferred from installed recipes, machine speeds, grid connection, proliferator mode, research modifiers, and relevant facility-specific factors. It is not actual output, a user-set production target, or a historical average.

Facility treatment:

- Idle, supply-starved, or output-blocked facilities: included at ideal rate if they have a recipe and are connected to a power network. Current inputs, outputs, and operating state are not consulted for the capacity calculation.
- Power:
  - A facility with no power-network connection is excluded from the total and identified as `Power grid disconnected`.
  - A connected machine is counted at full ideal rate even if the connected grid currently has inadequate generation. The calculation checks network connection, not current power satisfaction.
- Different machine tiers: handled through each machine’s own speed. Faster tiers contribute proportionally more.
- Proliferation:
  - `Proliferated (Extra mode)`: production Reference Rate receives the extra-product multiplier; input consumption remains at the base recipe rate.
  - `Proliferated (Speedup mode)`: production and consumption Reference Rates both receive the speed multiplier.
  - Mixed groups can be labeled `Proliferated (Extra / Speedup)`.
- Assemblers and Matrix Labs in matrix-production mode:
  - Base cycles/minute are derived from `3600 × machine speed ÷ recipe time`.
  - Recipe input/output quantities and proliferation are then applied.
- Matrix Labs in research mode:
  - Contribute matrix-consumption reference values based on the active technology’s matrix points and current research-speed modifier.
  - They do not contribute matrix production in research mode.
  - A lab without an active technology has no corresponding research-consumption capacity.
- Miners:
  - Count only when grid-connected.
  - Vein miners use mining period, mining-speed research, miner speed, and number of covered veins.
  - Oil extractors additionally use the current oil-vein amount.
  - Water pumps use their mining period, speed, and mining-speed modifier.
  - Current output blockage is not considered.
- Fractionators:
  - Count only when grid-connected.
  - Their reference product and feed consumption are equal net-conversion rates based on conversion probability, maximum stack level, and proliferator speedup.
  - This is net hydrogen converted to deuterium, not gross hydrogen belt throughput.

The Reference Rate tooltip groups entries by facility and exposes `Facility`, `State`, and `Rate (/min)`. Hovering a facility entry in that tooltip opens a further planet breakdown with facility counts, rates, and each planet’s share.

## Useful hover information

- Hover production, consumption, import, or export numbers:
  - Shows the corresponding exact rate, such as `Production Rate: 140.0 / min`.
  - Under `Total`, shows the applicable cumulative-total label.
- Hover either Reference Rate:
  - Exact explanation quoted above.
  - Facility/state/rate breakdown.
  - `No corresponding production facility` or `No corresponding consumption facility` when applicable.
- Hover `Storage Amount`:
  - `Total`
  - `Depot`
  - `Logistics Depot`
  - `Conveyor Belt`
  - `Icarus`, when applicable
  - `Other Facilities`
  - Zero-valued categories may be omitted.
- Hover `Import Storage`:
  - “The quantity of the item currently stored in the Interstellar Logistics Stations, with a status of remote demand.”
- Hover `Export Storage`:
  - “…stored in the Interstellar Logistics Stations, with a status of remote supply.”
- Hover the graph:
  - `Start Time`
  - `Period`
  - Upper half: `Production` and `Import`
  - Lower half: `Consumption` and `Export`
  - At `1 minute`, each graph column represents `1s`.
  - At `10 minutes`, each column represents `10s`.
- Hover the upstream icon:
  - `Raw Material Statistics`
  - `Click to view the raw material statistics.`
- Hover the downstream icon:
  - `Product Statistics`
  - `Click to view the product statistics.`
- Hover either circular refresh arrow:
  - `Left-click to refresh the statistics;`
  - `Right-click to show the real-time statistics.`
  - `Time consumed for the last refresh: … ms`

## “Real-time Stats”

There is no standalone toggle visibly labeled `Real-time Stats`. The exact visible instruction is:

> Right-click to show the real-time statistics.

Right-click either circular refresh arrow beside Reference Rate or Storage Amount. Both arrows control the same global continuous-refresh state.

When enabled:

- Reference Rates are recalculated repeatedly.
- `Storage Amount`, detailed storage breakdown, `Import Storage`, `Export Storage`, and `Litter Amount` are repeatedly refreshed.
- Reference Rates remain `/min`.
- Storage and litter values remain item counts.
- The selected location scope still applies.
- The selected historical interval still applies to measured production, consumption, import, export, and the graph.
- It does not convert those historical figures into instantaneous rates.

Update cadence is calculation-bound, not a fixed once-per-second sampler. The code spends one simulation tick starting the calculation, one on litter, one per included factory, and one completing/player storage. For `N` factories, a cycle is approximately `N + 3` simulation ticks. At nominal 60 UPS, `Local planet` with one factory can refresh roughly 15 times per second; larger scopes refresh less frequently.

Difference from `1 minute`:

- `1 minute` is measured item movement over the trailing 60 seconds, normalized to `/min`, with 1-second graph columns.
- Real-time mode continuously recomputes ideal capacity and current inventory snapshots.
- They are complementary settings and can be active together.

## Search and dependency lookup

- Search is a case-insensitive substring match on the localized item name.
- Searching `Electromagnetic Matrix` reduces the list to the blue-cube row.
- Clicking `Raw Material Statistics` clears text search and shows:
  - the selected item;
  - its direct recipe inputs.
- For Electromagnetic Matrix, the direct inputs are `Magnetic Coil` and `Circuit Board`.
- Clicking `Product Statistics` instead shows direct recipe outputs that consume the selected item.
- The filter tag is visibly `Material of` or `Product of`.
- Dependency lookup is direct, not recursively transitive. Click the upstream button again on an ingredient to walk one more recipe step.
- Items with no production, consumption, import, or export activity in the selected scope are filtered out, even when related by recipe.

## Import/export beginner trap

Production/consumption and import/export describe different events:

- Production and consumption are factory transformations within the selected scope.
- Import and export are item movements across that scope’s boundary.
- Import does not count as production.
- Export does not count as consumption.
- Moving an item between two planets counts for each planet’s boundary, but is internal when viewing their shared system.
- `Import Storage` and `Export Storage` are current ILS inventories assigned to Remote Demand/Supply; they are not traffic rates.
- A planet can therefore have zero local production but substantial consumption supported by imports.
- Conversely, production can exceed local consumption because goods are being exported or accumulated in storage.

## Compact factual inventory

### Controls

- Open with `P` or the bottom-right Statistics button.
- Select `Production`.
- Scope: `Entire star cluster`, `Local planet`, named `<star> System`, or named factory planet.
- Intervals: `1 minute`, `10 minutes`, `1 hour`, `10 hours`, `100 hours`, `Total`.
- Search is case-insensitive substring matching.
- Left-click a circular arrow for a manual refresh; right-click it for continuous real-time refresh.

### What each row shows

- Production and consumption.
- Their separate Reference Rates.
- Import and export.
- Import Storage and Export Storage.
- Storage Amount and Litter Amount.
- Historical production/import and consumption/export graph.
- Favorite controls and direct upstream/downstream lookup buttons.
- Historical intervals display average rates normalized to `/min`; `Total` displays cumulative counts.

### Reference Rate

- Ideal configured capacity, not actual performance or a player-set target.
- Includes connected idle, starved, and blocked machines at ideal rate.
- Excludes machines disconnected from a power network.
- Connected but power-starved grids still count at full ideal rate.
- Applies machine tier, recipe speed, proliferators, research modifiers, and facility-specific formulas.
- Tooltip breaks the figure down by facility, state, rate, and—on deeper hover—planet.

### Tooltips

- Numeric rate or total.
- Reference Rate explanation and facility breakdown.
- Storage breakdown by Depot, Logistics Depot, Conveyor Belt, Icarus, and Other Facilities.
- Import/Export Storage definitions.
- Graph start time, sampling period, and exact column values.
- Upstream/downstream button behavior.
- Refresh cost and real-time activation instruction.

### Real-time Stats

- No standalone visible label; activation wording is `Right-click to show the real-time statistics.`
- Continuously refreshes Reference Rates and inventory/litter snapshots.
- Does not replace the selected historical interval.
- Does not create instantaneous production/consumption rates.
- Recalculation cadence depends on the number of factories in scope.

### Verified beginner workflow

1. Press `P`; select `Production`.
2. Select `Local planet`.
3. Select `1 minute` for a fast view of the recent blue-cube shortfall.
4. Search `Electromagnetic Matrix`.
5. Compare `Production Rate` with production `Reference Rate`.
   - A lower actual rate proves that the installed lab capacity was not achieved during that window.
   - It does not by itself distinguish input starvation, output blockage, or power-satisfaction problems.
6. Hover the production Reference Rate to confirm the contributing Matrix Labs and their ideal combined rate.
7. Click `Raw Material Statistics`.
   - Inspect the direct inputs `Magnetic Coil` and `Circuit Board`.
8. Change the interval to `10 minutes` for a steadier rolling average.
9. For each ingredient, compare:
   - actual Production Rate and Import Rate;
   - Consumption Rate and consumption Reference Rate;
   - current Storage Amount.
10. Treat the first direct ingredient whose actual supply/performance remains below its relevant reference demand—especially with little inventory—as the first underperforming candidate.
11. Click that ingredient’s `Raw Material Statistics` button to move one recipe step farther upstream.
12. Confirm the suspected cause at the factory. The Statistics panel identifies the underperforming stage, but a Reference Rate gap alone does not prove whether its exact cause is starvation, blockage, insufficient grid supply, or another operating constraint.
