import { Handle, Position, type NodeProps } from '@xyflow/react';
import styles from './nodes.module.css';

type TaskNodeData = {
  label: string;
  actor: string;
  color: string;
};

export function TaskNode({ data }: NodeProps) {
  const nodeData = data as TaskNodeData;

  return (
    <div className={styles.taskNode} style={{ backgroundColor: nodeData.color }}>
      <Handle type="target" position={Position.Top} />
      <div className={styles.nodeTitle}>{nodeData.label}</div>
      <div className={styles.nodeMeta}>{nodeData.actor}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
