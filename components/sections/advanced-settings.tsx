import {
  StyledCard,
  StyledHeader,
  StyledTitle,
  StyledDescription,
  StyledContent,
  type StyledCardProps,
} from "@/components/ui/styled-card";
import { StyledSlider } from "@/components/ui/styled-slider";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";

interface SettingConfig {
  key: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  precision: number;
  description: string;
  onChange: (value: number) => void;
}

interface AdvancedSettingsProps {
  title?: string;
  description?: string;
  settings: SettingConfig[];
  cardSettings: StyledCardProps;
}

export function AdvancedSettings({
  title = "Advanced Settings",
  description = "Fine-tune biological parameters for more accurate predictions",
  settings,
  cardSettings,
}: AdvancedSettingsProps) {
  return (
    <Disclosure>
      {({ open }) => (
        <div>
          <DisclosureButton className="w-full">
            <StyledCard
              cardPadding={cardSettings.cardPadding}
              cardPerimeter={cardSettings.cardPerimeter}
              cardBackground={cardSettings.cardBackground}
              backgroundColor={cardSettings.backgroundColor}
            >
              <StyledHeader className="flex flex-row justify-between items-center">
                <div className="flex flex-col text-left">
                  <StyledTitle>{title}</StyledTitle>
                  <StyledDescription>{description}</StyledDescription>
                </div>
                <ChevronDown
                  className={`${
                    open ? "rotate-180" : ""
                  } h-5 w-5 text-gray-500 transition-transform`}
                />
              </StyledHeader>
            </StyledCard>
          </DisclosureButton>
          <DisclosurePanel className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settings.map((setting) => (
                <StyledCard
                  key={setting.key}
                  cardPadding={cardSettings.cardPadding}
                  cardPerimeter={cardSettings.cardPerimeter}
                  cardBackground={cardSettings.cardBackground}
                  backgroundColor={cardSettings.backgroundColor}
                >
                  <StyledContent className="space-y-4">
                    <StyledSlider
                      label={setting.label}
                      value={setting.value}
                      min={setting.min}
                      max={setting.max}
                      step={setting.step}
                      unit={setting.unit}
                      precision={setting.precision}
                      onValueChange={setting.onChange}
                    />
                    <p className="text-xs text-gray-600">
                      {setting.description}
                    </p>
                  </StyledContent>
                </StyledCard>
              ))}
            </div>
          </DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
}
