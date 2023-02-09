import { FiTrash2 } from "react-icons/fi";

import { RadioGroup } from "@/components/radio-group";
import { type DatabaseTypes, databaseTypes, techs } from "@/utils/defaults";

export const AddButton = ({ label, onClick }: { onClick: () => void; label: string }) => {
  return (
    <button className="rounded-xl bg-stone-600 px-4 py-2 hover:bg-stone-500" onClick={onClick}>
      {label}
    </button>
  );
};

const DeleteButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button className="rounded-xl bg-red-500 p-2 hover:bg-red-400" onClick={onClick}>
      <FiTrash2 />
    </button>
  );
};

export const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <section className="flex flex-col gap-y-4 rounded-lg bg-slate-500 p-4">
      <h3 className="text-3xl">{title}</h3>

      {children}
    </section>
  );
};

type EnvCardProps = {
  onChange: (newValue: string) => void;
  onDelete: () => void;
};

export const EnvCard = ({ onChange, onDelete }: EnvCardProps) => {
  return (
    <li className="flex flex-row items-center justify-between gap-4 rounded bg-slate-600 p-4">
      <input
        className="grow rounded px-4 py-2 text-sm font-medium text-gray-900"
        type="text"
        onChange={(evt) => onChange(evt.target.value)}
      />
      <DeleteButton onClick={onDelete} />
    </li>
  );
};

type AppCardProps = EnvCardProps & {
  updateAppTech: (tech: string) => void;
};

export const AppCard = ({ onChange, onDelete, updateAppTech }: AppCardProps) => {
  return (
    <li className="flex flex-col gap-4 rounded bg-slate-600 p-4">
      <div className="flex items-center justify-between gap-4">
        <input
          className="grow rounded px-4 py-2 text-sm font-medium text-gray-900"
          type="text"
          onChange={(evt) => onChange(evt.target.value)}
        />
        <DeleteButton onClick={onDelete} />
      </div>

      <div className="flex flex-col gap-1">
        <h5 className="text-xl">Technology</h5>

        <RadioGroup
          options={techs?.map((t) => t.label) || []}
          onSelectedChange={(val) => updateAppTech(val)}
        />
      </div>
    </li>
  );
};

type DatabaseCardProps = EnvCardProps & {
  updateDatabaseType: (type: DatabaseTypes) => void;
};

export const DatabaseCard = ({ onChange, onDelete, updateDatabaseType }: DatabaseCardProps) => {
  return (
    <li className="flex flex-col gap-4 rounded bg-slate-600 p-4">
      <div className="flex items-center justify-between gap-4">
        <input
          className="grow rounded px-4 py-2 text-sm font-medium text-gray-900"
          type="text"
          onChange={(evt) => onChange(evt.target.value)}
        />
        <DeleteButton onClick={onDelete} />
      </div>

      <div className="flex flex-col gap-1">
        <h5 className="text-xl">Type</h5>

        <RadioGroup
          options={databaseTypes?.map((t) => t.label) || []}
          onSelectedChange={(val) => updateDatabaseType(val)}
        />
      </div>
    </li>
  );
};
